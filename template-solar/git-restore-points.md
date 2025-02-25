# Git Restore Points Guide for Solar Template

This guide will help you use Git as a restore point system while customizing the Solar template.

## Current Setup

- Original template code is in the `main` branch
- Your customizations are in the `custom-development` branch

## Creating Restore Points

To create a restore point (checkpoint) after making changes:

1. Stage your changes:
   ```powershell
   git add .
   ```

2. Commit your changes with a descriptive message:
   ```powershell
   git commit -m "Restore point: [DESCRIPTION OF CHANGES]"
   ```

   For example:
   ```powershell
   git commit -m "Restore point: Customized hero section colors"
   ```

## Viewing Restore Points

To see all your restore points:

```powershell
git log --oneline
```

## Restoring to a Previous Point

If you need to go back to a previous restore point:

1. Find the commit ID from the log:
   ```powershell
   git log --oneline
   ```

2. Restore to that point (two options):

   a. Soft restore (keeps changes staged):
   ```powershell
   git reset --soft [COMMIT_ID]
   ```

   b. Hard restore (completely reverts to that point, discarding all changes):
   ```powershell
   git reset --hard [COMMIT_ID]
   ```

   For example:
   ```powershell
   git reset --hard abc1234
   ```

## Creating Named Restore Points (Tags)

For important milestones, you can create named tags:

1. Create a tag:
   ```powershell
   git tag -a v1.0 -m "Version 1.0 - Initial customization"
   ```

2. View all tags:
   ```powershell
   git tag
   ```

3. Restore to a tagged version:
   ```powershell
   git checkout v1.0
   ```

## Branching for Major Changes

If you want to try a major change without risking your current work:

1. Create a new branch from your current state:
   ```powershell
   git checkout -b feature/new-homepage
   ```

2. Make your changes in this branch

3. If you like the changes, merge them back:
   ```powershell
   git checkout custom-development
   git merge feature/new-homepage
   ```

4. If you don't like the changes, simply go back to your main branch:
   ```powershell
   git checkout custom-development
   ```

## Best Practices

1. Create restore points (commits) frequently
2. Use descriptive commit messages
3. Create tags for major milestones
4. Use branches for experimental features
5. Always commit before making major changes

## Quick Reference

- Create restore point: `git add .; git commit -m "Restore point: [DESCRIPTION]"`
- View restore points: `git log --oneline`
- Restore to previous point: `git reset --hard [COMMIT_ID]`
- Create named restore point: `git tag -a [TAG_NAME] -m "[DESCRIPTION]"`
- Switch to named restore point: `git checkout [TAG_NAME]` 