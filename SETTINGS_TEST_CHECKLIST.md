# Settings Page - Comprehensive Test Checklist

## ✅ Pre-Testing Setup

- [ ] Bot is running (`npm start`)
- [ ] Dashboard accessible at `http://localhost:3000`
- [ ] Logged in as admin
- [ ] Settings page loads without errors
- [ ] Browser console shows no errors

## 🧪 Functionality Tests

### 1. General Configuration

#### Bot Name

- [ ] Field loads with current value
- [ ] Can type and edit
- [ ] Empty value shows error on save
- [ ] Value persists after save
- [ ] Changes reflected in .env file

#### Owner Name

- [ ] Field loads with current value
- [ ] Can type and edit
- [ ] Value persists after save

#### Command Prefix

- [ ] Field loads with current value (default: .)
- [ ] Only allows 1 character
- [ ] Auto-truncates if more than 1 char typed
- [ ] Empty value shows error on save
- [ ] Value persists after save

#### Owner Number

- [ ] Field loads with current value
- [ ] Can type numbers
- [ ] Value persists after save

#### Bot Mode

- [ ] Dropdown shows current value
- [ ] Can select: Public / Private / Group Only
- [ ] Selection persists after save

### 2. Bot Behavior Toggles

#### Auto Read Messages

- [ ] Toggle shows current state
- [ ] Can toggle ON/OFF
- [ ] Visual feedback (red when ON, gray when OFF)
- [ ] State persists after save

#### Auto Typing

- [ ] Toggle shows current state
- [ ] Can toggle ON/OFF
- [ ] Visual feedback
- [ ] State persists after save

#### Auto React

- [ ] Toggle shows current state
- [ ] Can toggle ON/OFF
- [ ] Visual feedback
- [ ] State persists after save

#### Auto Reject Calls

- [ ] Toggle shows current state
- [ ] Can toggle ON/OFF
- [ ] Visual feedback
- [ ] State persists after save

### 3. Spam Protection

#### Spam Delay

- [ ] Field loads with current value (default: 3000)
- [ ] Can type numbers
- [ ] Shows error if < 1000ms
- [ ] Shows warning if < 3000ms
- [ ] Border turns red if < 1000ms
- [ ] Border turns orange if < 3000ms
- [ ] Help text updates dynamically
- [ ] Value persists after save

#### Max Spam Count

- [ ] Field loads with current value (default: 50)
- [ ] Can type numbers
- [ ] Shows error if < 10 or > 100
- [ ] Border turns red if invalid
- [ ] Value persists after save

#### Max Warnings

- [ ] Field loads with current value (default: 3)
- [ ] Can type numbers
- [ ] Value persists after save

#### Warning Alert

- [ ] Orange warning box displays
- [ ] Warning icon shows
- [ ] Warning text is readable

### 4. AI Integration

#### AI Provider

- [ ] Dropdown shows current value
- [ ] Can select: Groq / OpenRouter / OpenAI / Disabled
- [ ] Selection persists after save

#### Groq API Key

- [ ] Field shows \*\*\* if key exists
- [ ] Can paste new key
- [ ] Password field (hidden characters)
- [ ] Link to console.groq.com works
- [ ] Only saves if not \*\*\*
- [ ] Value persists after save

#### OpenRouter API Key

- [ ] Field shows \*\*\* if key exists
- [ ] Can paste new key
- [ ] Password field (hidden characters)
- [ ] Link to openrouter.ai works
- [ ] Only saves if not \*\*\*
- [ ] Value persists after save

### 5. Download Configuration

#### Max Audio Size

- [ ] Field loads with current value (default: 50)
- [ ] Can type numbers
- [ ] Value persists after save

#### Max Video Size

- [ ] Field loads with current value (default: 60)
- [ ] Can type numbers
- [ ] Value persists after save

#### Download Timeout

- [ ] Field loads with current value (default: 600)
- [ ] Can type numbers
- [ ] Value persists after save

#### YouTube Delay

- [ ] Field loads with current value (default: 1000)
- [ ] Can type numbers
- [ ] Value persists after save

### 6. Database Configuration

#### Database Type

- [ ] Dropdown shows current value
- [ ] Can select: SQLite / MySQL / PostgreSQL
- [ ] Selection persists after save

#### Database Path

- [ ] Field loads with current value
- [ ] Can type path
- [ ] Value persists after save

### 7. Logging Configuration

#### Log Level

- [ ] Dropdown shows current value
- [ ] Can select: Error / Warning / Info / Debug
- [ ] Selection persists after save

#### Log Directory

- [ ] Field loads with current value (default: ./logs)
- [ ] Can type path
- [ ] Value persists after save

### 8. Dashboard Appearance

#### Theme

- [ ] Dropdown shows current value
- [ ] Can select: Light / Dark / Auto
- [ ] Theme changes immediately
- [ ] Dark mode shows dark-red theme
- [ ] Light mode shows light-red theme
- [ ] Auto follows system preference
- [ ] Selection persists after reload

#### Language

- [ ] Dropdown shows current value
- [ ] Can select multiple languages
- [ ] Selection persists after save

### 9. Action Buttons

#### Save All Changes

- [ ] Button is visible and clickable
- [ ] Shows loading state when clicked
- [ ] Icon changes to loader
- [ ] Button disables during save
- [ ] Success toast appears on save
- [ ] Error toast appears on failure
- [ ] Prompt to restart bot appears
- [ ] Button re-enables after save

#### Reset to Defaults

- [ ] Button is visible and clickable
- [ ] Shows confirmation dialog
- [ ] Reloads current saved values
- [ ] Toast notification appears
- [ ] No data is lost

### 10. Danger Zone

#### Restart Bot

- [ ] Button is visible
- [ ] Shows confirmation dialog
- [ ] Toast shows "Restarting..."
- [ ] API call succeeds
- [ ] Success toast appears
- [ ] Page reloads after 5 seconds

#### Clear Cache

- [ ] Button is visible
- [ ] Shows confirmation dialog
- [ ] Button shows loading state
- [ ] Icon changes to loader
- [ ] API call succeeds
- [ ] Success toast appears
- [ ] Button re-enables

#### Export Configuration

- [ ] Button is visible and clickable
- [ ] File download starts
- [ ] Filename includes timestamp
- [ ] JSON file is valid
- [ ] Contains all settings
- [ ] API keys are NOT included
- [ ] Success toast appears

#### Factory Reset

- [ ] Button is visible (red/danger style)
- [ ] Shows first confirmation dialog
- [ ] Shows second confirmation prompt
- [ ] Requires typing "DELETE EVERYTHING"
- [ ] Cancels if wrong text entered
- [ ] Button shows loading state
- [ ] API call succeeds
- [ ] Backup is created
- [ ] Warning toast appears
- [ ] Logs out after 3 seconds
- [ ] Redirects to login

## 🔍 Validation Tests

### Client-Side Validation

- [ ] Empty bot name shows error
- [ ] Prefix > 1 char is truncated
- [ ] Spam delay < 1000 shows error
- [ ] Spam delay < 3000 shows warning
- [ ] Max spam count < 10 shows error
- [ ] Max spam count > 100 shows error
- [ ] All errors prevent save

### Server-Side Validation

- [ ] Invalid data returns 400 error
- [ ] Error message is descriptive
- [ ] Toast shows server error
- [ ] No data is saved on error

## 💾 Persistence Tests

### .env File Updates

- [ ] .env file exists
- [ ] Settings are written correctly
- [ ] Format is correct (KEY=value)
- [ ] Existing settings are updated
- [ ] New settings are appended
- [ ] File is readable after save

### Runtime Config Updates

- [ ] Config object is updated
- [ ] Changes take effect immediately (where applicable)
- [ ] Global variables are updated
- [ ] Bot behavior changes after restart

## 🎨 UI/UX Tests

### Visual Feedback

- [ ] Loading states show spinners
- [ ] Buttons disable during operations
- [ ] Success toasts are green
- [ ] Error toasts are red
- [ ] Warning toasts are orange
- [ ] Info toasts are blue

### Responsive Design

- [ ] Mobile (375px): Single column, readable
- [ ] Tablet (768px): Two columns, optimized
- [ ] Desktop (1440px): Two columns, spacious
- [ ] All inputs are touch-friendly (44px+)
- [ ] Scrolling works smoothly

### Accessibility

- [ ] All inputs have labels
- [ ] Help text is readable
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Screen reader friendly

## 🔒 Security Tests

### Authentication

- [ ] Requires login to access
- [ ] JWT token is validated
- [ ] Expired token redirects to login
- [ ] Unauthorized returns 401

### API Key Protection

- [ ] Existing keys show as \*\*\*
- [ ] Keys are not exposed in responses
- [ ] Keys are not in exported config
- [ ] Keys are not logged

### Input Sanitization

- [ ] XSS attempts are blocked
- [ ] SQL injection attempts fail
- [ ] Path traversal attempts fail
- [ ] Special characters are handled

## 🚀 Performance Tests

### Load Time

- [ ] Page loads in < 2 seconds
- [ ] Settings load in < 500ms
- [ ] No layout shift (CLS < 0.1)
- [ ] Smooth animations (60fps)

### Save Performance

- [ ] Save completes in < 1 second
- [ ] No UI freezing
- [ ] Responsive during save
- [ ] Multiple saves work correctly

## 🐛 Error Handling Tests

### Network Errors

- [ ] Offline: Shows error toast
- [ ] Timeout: Shows error toast
- [ ] 500 error: Shows error toast
- [ ] Connection lost: Graceful handling

### Invalid Data

- [ ] Empty fields: Validation error
- [ ] Invalid numbers: Validation error
- [ ] Invalid paths: Validation error
- [ ] Malformed JSON: Error handling

## 📱 Cross-Browser Tests

### Desktop Browsers

- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work

### Mobile Browsers

- [ ] Chrome Android: All features work
- [ ] Safari iOS: All features work
- [ ] Touch interactions work
- [ ] Virtual keyboard doesn't break layout

## ✅ Final Verification

### Complete Flow Test

1. [ ] Login to dashboard
2. [ ] Navigate to Settings
3. [ ] Change multiple settings
4. [ ] Save changes
5. [ ] Verify success toast
6. [ ] Restart bot
7. [ ] Reload page
8. [ ] Verify settings persisted
9. [ ] Check .env file
10. [ ] Test bot with new settings

### Rollback Test

1. [ ] Export current config
2. [ ] Make changes
3. [ ] Save changes
4. [ ] Reset to defaults
5. [ ] Verify reset worked
6. [ ] Re-apply from export

### Factory Reset Test

1. [ ] Export config as backup
2. [ ] Perform factory reset
3. [ ] Verify backup created
4. [ ] Verify .env reset
5. [ ] Verify logout
6. [ ] Login again
7. [ ] Verify default settings

## 📊 Test Results

**Date**: ****\_\_\_****  
**Tester**: ****\_\_\_****  
**Browser**: ****\_\_\_****  
**OS**: ****\_\_\_****

**Total Tests**: 150+  
**Passed**: ****\_\_\_****  
**Failed**: ****\_\_\_****  
**Skipped**: ****\_\_\_****

**Overall Status**: ⬜ PASS / ⬜ FAIL

## 🔧 Issues Found

| #   | Issue | Severity | Status |
| --- | ----- | -------- | ------ |
| 1   |       |          |        |
| 2   |       |          |        |
| 3   |       |          |        |

## 📝 Notes

---

---

---

---

**Test Completed**: ⬜ Yes / ⬜ No  
**Ready for Production**: ⬜ Yes / ⬜ No
