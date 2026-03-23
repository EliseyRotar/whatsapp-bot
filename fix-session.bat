@echo off
echo.
echo  WhatsApp Bot Session Fix
echo  =======================================
echo.

if exist "auth_info" (
    echo  Found existing session data...
    echo.

    :: Create timestamp for backup name
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set dt=%%I
    set backup=auth_info_backup_%dt:~0,8%_%dt:~8,6%

    echo  Creating backup: %backup%
    xcopy /E /I /Q "auth_info" "%backup%" >nul
    echo  Backup created successfully.
    echo.

    echo  Removing current session...
    rmdir /S /Q "auth_info"
    echo  Session cleared.
) else (
    echo  No existing session found.
)

echo.
echo  Session fix complete!
echo.
echo  Next steps:
echo    1. Run: npm start
echo    2. Scan QR code with WhatsApp mobile app
echo    3. Bot will create a new session
echo.
pause
