import json
import os
from typing import List, Optional, Any
from pathlib import Path
import threading

# Thread-safe file operations
_file_locks = {}
_lock = threading.Lock()

def get_file_lock(filename: str):
    """Get or create a lock for a specific file"""
    with _lock:
        if filename not in _file_locks:
            _file_locks[filename] = threading.Lock()
        return _file_locks[filename]

# Data directory
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

class JSONStorage:
    """Simple JSON file storage with CRUD operations"""
    
    def __init__(self, filename: str):
        self.filepath = DATA_DIR / filename
        self.lock = get_file_lock(filename)
        # Ensure file exists
        if not self.filepath.exists():
            self._write([])
    
    def _read(self) -> List[dict]:
        """Read data from JSON file"""
        with self.lock:
            try:
                with open(self.filepath, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return []
    
    def _write(self, data: Any):
        """Write data to JSON file"""
        with self.lock:
            with open(self.filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
    
    def find_all(self, filter_dict: Optional[dict] = None) -> List[dict]:
        """Find all items matching filter"""
        data = self._read()
        if not filter_dict:
            return data
        
        # Simple filtering
        result = []
        for item in data:
            match = True
            for key, value in filter_dict.items():
                if item.get(key) != value:
                    match = False
                    break
            if match:
                result.append(item)
        return result
    
    def find_one(self, filter_dict: dict) -> Optional[dict]:
        """Find first item matching filter"""
        items = self.find_all(filter_dict)
        return items[0] if items else None
    
    def insert_one(self, item: dict) -> dict:
        """Insert a new item"""
        data = self._read()
        data.append(item)
        self._write(data)
        return item
    
    def update_one(self, filter_dict: dict, update_dict: dict) -> bool:
        """Update first item matching filter"""
        data = self._read()
        updated = False
        
        for i, item in enumerate(data):
            match = True
            for key, value in filter_dict.items():
                if item.get(key) != value:
                    match = False
                    break
            
            if match:
                # Update fields
                for key, value in update_dict.items():
                    item[key] = value
                data[i] = item
                updated = True
                break
        
        if updated:
            self._write(data)
        return updated
    
    def delete_one(self, filter_dict: dict) -> bool:
        """Delete first item matching filter"""
        data = self._read()
        original_length = len(data)
        
        for i, item in enumerate(data):
            match = True
            for key, value in filter_dict.items():
                if item.get(key) != value:
                    match = False
                    break
            
            if match:
                data.pop(i)
                break
        
        if len(data) < original_length:
            self._write(data)
            return True
        return False
    
    def count(self, filter_dict: Optional[dict] = None) -> int:
        """Count items matching filter"""
        return len(self.find_all(filter_dict))
    
    def clear(self):
        """Clear all data"""
        self._write([])


class JSONStorageSingle:
    """JSON storage for single object (like settings)"""
    
    def __init__(self, filename: str, default_data: dict):
        self.filepath = DATA_DIR / filename
        self.lock = get_file_lock(filename)
        self.default_data = default_data
        # Ensure file exists with defaults
        if not self.filepath.exists():
            self._write(default_data)
    
    def _read(self) -> dict:
        """Read data from JSON file"""
        with self.lock:
            try:
                with open(self.filepath, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return self.default_data.copy()
    
    def _write(self, data: dict):
        """Write data to JSON file"""
        with self.lock:
            with open(self.filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
    
    def get(self) -> dict:
        """Get settings"""
        return self._read()
    
    def update(self, update_dict: dict) -> dict:
        """Update settings"""
        data = self._read()
        data.update(update_dict)
        self._write(data)
        return data


# Initialize storages
themes_storage = JSONStorage("themes.json")
products_storage = JSONStorage("products.json")
hero_storage = JSONStorage("hero.json")
settings_storage = JSONStorageSingle("settings.json", {
    "whatsapp_number": "+1234567890",
    "site_title": "Tambe - Precision Engineered Gears",
    "meta_description": "Leading manufacturer of precision-engineered vehicle gears",
    "contact_email": "info@tambeglobal.com",
    "updated_at": None
})
