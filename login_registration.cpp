#include <iostream>
#include <fstream>
#include <string>
#include <direct.h>  // For _mkdir
#include <conio.h>   // For _getch

// Function prototypes
void displayMenu();
void registerUser();
bool loginUser();
bool validateUsername(const std::string& username);
bool validatePassword(const std::string& password);
std::string hashPassword(const std::string& password);
void clearScreen();
void displayHeader();
void createUserDatabase();
bool fileExists(const std::string& filename);

// Constants
const std::string DATABASE_DIR = "user_database";

int main() {
    // Create database directory if it doesn't exist
    createUserDatabase();

    int choice;
    bool exitProgram = false;

    while (!exitProgram) {
        clearScreen();
        displayHeader();
        displayMenu();

        std::cout << "\nEnter your choice (1-3): ";
        std::cin >> choice;

        // Simple input validation
        if (choice < 1 || choice > 3) {
            std::cout << "Invalid choice. Please try again.\n";
            std::cout << "Press any key to continue...";
            _getch();
            continue;
        }

        std::cin.ignore(); // Clear input buffer

        switch (choice) {
            case 1:
                registerUser();
                break;
            case 2:
                if (loginUser()) {
                    clearScreen();
                    displayHeader();
                    std::cout << "\n\n\tLogin successful! Welcome to the system.\n";
                    std::cout << "\n\tPress any key to continue...";
                    _getch();
                }
                break;
            case 3:
                exitProgram = true;
                break;
        }
    }

    clearScreen();
    std::cout << "\n\n\tThank you for using the Login & Registration System!\n";
    std::cout << "\n\tPress any key to exit...";
    _getch();

    return 0;
}

// Create user database directory
void createUserDatabase() {
    _mkdir(DATABASE_DIR.c_str());
}

// Check if file exists
bool fileExists(const std::string& filename) {
    std::ifstream file(filename);
    return file.good();
}

// Display the main menu
void displayMenu() {
    std::cout << "\n\n\t=== MENU ===\n";
    std::cout << "\t1. Register\n";
    std::cout << "\t2. Login\n";
    std::cout << "\t3. Exit\n";
}

// Display header
void displayHeader() {
    std::cout << "\n\t======================================\n";
    std::cout << "\t   LOGIN AND REGISTRATION SYSTEM\n";
    std::cout << "\t======================================\n";
}

// Clear the console screen
void clearScreen() {
    #ifdef _WIN32
        system("cls");
    #else
        system("clear");
    #endif
}

// Register a new user
void registerUser() {
    clearScreen();
    displayHeader();
    std::cout << "\n\n\t=== USER REGISTRATION ===\n";

    std::string username, password, confirmPassword;

    // Get and validate username
    do {
        std::cout << "\n\tEnter username (3-32 characters, alphanumeric only): ";
        std::getline(std::cin, username);

        // Check if user already exists
        std::string userFile = DATABASE_DIR + "/" + username + ".dat";
        if (fileExists(userFile)) {
            std::cout << "\n\tUsername already exists! Please choose another one.\n";
            continue;
        }
    } while (!validateUsername(username));

    // Get and validate password
    do {
        std::cout << "\n\tEnter password (min 8 characters, must include uppercase, lowercase, and digit): ";
        // Hide password input
        char ch;
        password = "";
        while ((ch = _getch()) != 13) { // 13 is Enter key
            if (ch == 8) { // Backspace
                if (!password.empty()) {
                    password.pop_back();
                    std::cout << "\b \b";
                }
            } else {
                password.push_back(ch);
                std::cout << "*";
            }
        }

        if (!validatePassword(password)) {
            std::cout << "\n";
            continue;
        }

        std::cout << "\n\n\tConfirm password: ";
        // Hide password input again
        confirmPassword = "";
        while ((ch = _getch()) != 13) {
            if (ch == 8) {
                if (!confirmPassword.empty()) {
                    confirmPassword.pop_back();
                    std::cout << "\b \b";
                }
            } else {
                confirmPassword.push_back(ch);
                std::cout << "*";
            }
        }

        if (password != confirmPassword) {
            std::cout << "\n\n\tPasswords do not match! Please try again.\n";
        }
    } while (password != confirmPassword || !validatePassword(password));

    // Hash the password (in a real system, use a proper hashing algorithm)
    std::string hashedPassword = hashPassword(password);

    // Create user file
    std::string userFile = DATABASE_DIR + "/" + username + ".dat";
    std::ofstream file(userFile, std::ios::binary);

    if (file.is_open()) {
        file << username << "\n" << hashedPassword;
        file.close();

        std::cout << "\n\n\tRegistration successful!\n";
    } else {
        std::cout << "\n\n\tError creating user file!\n";
    }

    std::cout << "\n\tPress any key to continue...";
    _getch();
}

// Login an existing user
bool loginUser() {
    clearScreen();
    displayHeader();
    std::cout << "\n\n\t=== USER LOGIN ===\n";

    std::string username, password;

    std::cout << "\n\tEnter username: ";
    std::getline(std::cin, username);

    std::cout << "\n\tEnter password: ";
    // Hide password input
    char ch;
    password = "";
    while ((ch = _getch()) != 13) {
        if (ch == 8) {
            if (!password.empty()) {
                password.pop_back();
                std::cout << "\b \b";
            }
        } else {
            password.push_back(ch);
            std::cout << "*";
        }
    }

    // Hash the entered password
    std::string hashedPassword = hashPassword(password);

    // Check if user exists
    std::string userFile = DATABASE_DIR + "/" + username + ".dat";
    if (!fileExists(userFile)) {
        std::cout << "\n\n\tUser does not exist!\n";
        std::cout << "\n\tPress any key to continue...";
        _getch();
        return false;
    }

    // Read user data
    std::ifstream file(userFile, std::ios::binary);
    if (file.is_open()) {
        std::string storedUsername, storedPassword;
        std::getline(file, storedUsername);
        std::getline(file, storedPassword);
        file.close();

        // Verify credentials
        if (username == storedUsername && hashedPassword == storedPassword) {
            return true;
        } else {
            std::cout << "\n\n\tInvalid username or password!\n";
            std::cout << "\n\tPress any key to continue...";
            _getch();
            return false;
        }
    } else {
        std::cout << "\n\n\tError reading user file!\n";
        std::cout << "\n\tPress any key to continue...";
        _getch();
        return false;
    }
}

// Validate username
bool validateUsername(const std::string& username) {
    // Check length
    if (username.length() < 3 || username.length() > 32) {
        std::cout << "\n\tUsername must be between 3 and 32 characters long!\n";
        return false;
    }

    // Check if alphanumeric
    for (char c : username) {
        if (!isalnum(c)) {
            std::cout << "\n\tUsername must contain only letters and numbers!\n";
            return false;
        }
    }

    return true;
}

// Validate password
bool validatePassword(const std::string& password) {
    // Check length
    if (password.length() < 8) {
        std::cout << "\n\tPassword must be at least 8 characters long!\n";
        return false;
    }

    // Check for uppercase, lowercase, and digit
    bool hasUpper = false, hasLower = false, hasDigit = false;

    for (char c : password) {
        if (isupper(c)) hasUpper = true;
        else if (islower(c)) hasLower = true;
        else if (isdigit(c)) hasDigit = true;
    }

    if (!hasUpper) {
        std::cout << "\n\tPassword must contain at least one uppercase letter!\n";
        return false;
    }

    if (!hasLower) {
        std::cout << "\n\tPassword must contain at least one lowercase letter!\n";
        return false;
    }

    if (!hasDigit) {
        std::cout << "\n\tPassword must contain at least one digit!\n";
        return false;
    }

    return true;
}

// Simple password hashing (for demonstration purposes only)
// In a real application, use a proper cryptographic library
std::string hashPassword(const std::string& password) {
    // This is a very simple hash function for demonstration
    // DO NOT use this in a real application!
    std::string hash = "";
    for (char c : password) {
        hash += std::to_string((int)c * 17 % 255);
    }
    return hash;
}
