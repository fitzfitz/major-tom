# Pull Request Review Checklist

## Summary

- [ ] PR title matches task
- [ ] PR links to task
- [ ] PR body includes summary
- [ ] PR body includes validation results
- [ ] PR body includes risk notes

## Scope

- [ ] Changes match acceptance criteria
- [ ] No unrelated files changed
- [ ] No unapproved dependency changes
- [ ] No unapproved migrations
- [ ] No forbidden paths modified

## Validation

- [ ] Lint passed
- [ ] Format check passed
- [ ] Build passed
- [ ] Tests passed, if applicable
- [ ] git diff --check passed

## Security

- [ ] No secrets added
- [ ] No auth/permission weakening
- [ ] No unsafe logging of sensitive data
- [ ] No production deployment changes without approval

## Final Decision

- [ ] Approve
- [ ] Request changes
- [ ] Block due to risk
