# CSV Import Test Files

This directory contains test CSV files for testing the coaches import functionality.

## Test Files

### `coaches-small.csv`
- **Purpose**: Basic functionality testing
- **Contents**: 5 valid email addresses
- **Expected Result**: All 5 coaches should import successfully

### `coaches-with-issues.csv`  
- **Purpose**: Validation testing
- **Contents**: 10 entries with various issues:
  - 4 valid emails
  - 4 invalid emails (missing @, malformed)
  - 2 duplicate emails
- **Expected Results**:
  - 4 valid emails imported
  - 4 invalid emails rejected with validation errors
  - 1 duplicate email rejected (only first occurrence kept)

### `coaches-large.csv`
- **Purpose**: Performance testing
- **Contents**: 50 valid email addresses (`coach1@testcompany.com` through `coach50@testcompany.com`)
- **Expected Result**: All 50 coaches should import successfully without performance issues

## Testing Instructions

1. **Small Import Test**:
   - Upload `coaches-small.csv`
   - Verify all 5 emails show as valid in preview
   - Import and confirm success

2. **Validation Test**:
   - Upload `coaches-with-issues.csv`
   - Verify preview shows:
     - 4 valid emails
     - 4 invalid emails listed with errors
     - 1 duplicate email detected
   - Import and confirm only 4 coaches added

3. **Large Import Test**:
   - Upload `coaches-large.csv`
   - Verify preview shows all 50 as valid
   - Import and confirm all 50 imported without timeout or errors
   - Check that the import completes in reasonable time (<10 seconds)

## CSV Format

All test files follow the expected format:
```csv
Email
user@domain.com
```

- First row contains the header "Email"
- Each subsequent row contains one email address
- No additional columns required