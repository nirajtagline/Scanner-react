import { exec } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// Convert fs.unlink (to delete file) to a promise-based function
const unlinkAsync = promisify(fs.unlink);
// Function to scan the document using NAPS2
const scanDocument = (options) => {
    return new Promise((resolve, reject) => {
        const { format = "pdf", dpi = 300, scannerName } = options;
        // Generate a temporary file path in the system's temporary directory
        const tempFilePath = path.join(os.tmpdir(), `scanned-document-${Date.now()}.pdf`);
        // Possible paths for the NAPS2 console executable
        const naps2Paths = [
            "C:\\Program Files\\NAPS2\\naps2.console.exe", // 64-bit installation
            "C:\\Program Files (x86)\\NAPS2\\naps2.console.exe", // 32-bit installation
        ];
        let command = "";
        let found = false;
        // Check each possible path and build the command when the executable is found
        for (let i = 0; i < naps2Paths.length; i++) {
            const currentPath = naps2Paths[i];
            // If the executable is found in one of the paths, run the command
            command = `"${currentPath}" -o "${tempFilePath}" -f ${format} --dpi ${dpi}`;
            if (scannerName) {
                command += ` --scanner "${scannerName}"`;
            }
            exec(command, (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    reject(`Error: ${stderr || error.message}`);
                }
                else {
                    // Once scanning is successful, read the file and return it as a buffer
                    try {
                        const fileBuffer = fs.readFileSync(tempFilePath);
                        // Delete the temporary file after reading
                        yield unlinkAsync(tempFilePath);
                        resolve(fileBuffer);
                    }
                    catch (readError) {
                        reject(`Error reading temporary file: ${readError.message}`);
                    }
                }
            }));
            found = true;
            break;
        }
        // If no executable is found, reject with an error message
        if (!found) {
            reject("Error: NAPS2 executable not found. Please check the installation path.");
        }
    });
};

export { scanDocument };
