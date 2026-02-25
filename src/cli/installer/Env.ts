import os from 'os';
import fs from 'fs';

export function getOS() {
  return os.platform();
}

export function isWindows() {
  return os.platform() === 'win32';
}

export function isDocker() {
  return fs.existsSync('/.dockerenv');
}
