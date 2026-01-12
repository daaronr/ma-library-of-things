# Contributing to MA Library of Things Database

Thank you for your interest in contributing! This project aims to make Library of Things programs more discoverable across Massachusetts.

## Ways to Contribute

### 1. Add Data for New Libraries

If you know of a library with a Library of Things program not yet in our database:

1. Fork the repository
2. Add the library to the appropriate JSON file in `data/`
3. Follow the data format below
4. Submit a pull request

**Data Format:**

```json
{
  "library": "Library Name",
  "category": "Category Name",
  "name": "Item Name",
  "description": "Brief description of item and what's included"
}
```

**Standard Categories:**
- Home Improvement
- Measurement & Detection
- Home Inspection
- Auto/Vehicle
- Bicycle
- Gardening
- Outdoor/Camping
- Outdoor Games
- Crafts/Sewing
- Technology
- Music
- Kitchen
- Party/Event
- Wellness/Health
- Games/Recreation
- Dolls

### 2. Verify Existing Data

Help us keep the database accurate:

1. Check items at your local library
2. Report inaccuracies via GitHub Issues
3. Submit corrections via pull request

### 3. Improve the Apps

The React apps in `apps/` can always be improved:

- Better search/filter functionality
- Accessibility improvements
- Mobile responsiveness
- New features (map view, availability status, etc.)

### 4. Add New Networks

Massachusetts has several library networks not yet covered:

- **SAILS**: Southeastern Massachusetts
- **NOBLE**: North of Boston
- **OCLN**: Old Colony Library Network
- **CLAMS**: Cape Libraries
- **MVLC**: Merrimack Valley

To add a new network:

1. Create a new JSON file: `data/{network}_items.json`
2. Follow the existing data structure
3. Add library contact information
4. Update README.md with network info

## Data Quality Standards

### Required Fields

Every item must have:
- `library`: Full library name
- `category`: One of the standard categories
- `name`: Item name as listed by library
- `description`: What's included

### Recommended Fields

- Source URL
- Verification date
- Lending period
- Restrictions (age, residency, etc.)

### Verification

Please verify data before submitting:
1. Check the library's website directly
2. Confirm item is currently available
3. Use official item names from the library

## Code Style

### JSON Files

- Use 2-space indentation
- Sort items alphabetically by library, then category, then name
- Use consistent capitalization

### React/JavaScript

- Use functional components with hooks
- Follow existing naming conventions
- Include comments for complex logic

### Python

- Follow PEP 8
- Include docstrings
- Use type hints where helpful

## Submitting Changes

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b add-sails-network`
3. Make your changes
4. Test locally if applicable
5. Commit with clear messages: `git commit -m "Add SAILS network data (15 libraries)"`
6. Push to your fork: `git push origin add-sails-network`
7. Open a Pull Request

### PR Description Template

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] New library data
- [ ] Data correction
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation

## Libraries Affected
- Library Name 1
- Library Name 2

## Verification
- [ ] Data verified against library website
- [ ] Contact information confirmed
- [ ] Tested locally (if code change)

## Notes
Any additional context
```

## Questions?

- Open a GitHub Issue for questions
- Contact project maintainer: David (see README for contact info)

## Code of Conduct

- Be respectful and inclusive
- Focus on improving public access to library resources
- Credit sources appropriately
- Respect library staff time when verifying information

---

Thank you for helping make Library of Things programs more accessible to everyone!
