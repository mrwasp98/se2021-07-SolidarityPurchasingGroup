TEMPLATE FOR RETROSPECTIVE (Team 07)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done => 5 vs 5
- Total points committed vs done => 36 vs 36
- Nr of hours planned vs spent (as a team) =>  112 vs ???

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Our DoD: A story is done when the backed tests performed by `jest` ends successfully and when the frontend tests performed by `cypress` are correctly completed.
### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    12   |    -   |    40h     |     80h      |
| _#40_  |    1    |    13  |    26h     |     ???      |
| _#41_  |    3    |    5   |    10h     |   7h 25m     |
| _#42_  |    3    |    8   |    16h     |   7h 40m     |
| _#43_  |    1    |    5   |    10h     |   6h 45m     |
| _#15_  |    3    |    5   |    10h     |       6h     |


- Hours per task (average, standard deviation): 3h 40m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 1.02

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 8h
  - Total hours spent: 9h25m
  - Nr of automated unit test cases: 70 (backend)
  - Coverage (if available): 80.65% (jtest), 72.22% (cypress)
- E2E testing:
  - Total hours estimated: 5h
  - Total hours spent: 5h
- Code review 
  - Total hours estimated: included in Technical Debt management
  - Total hours spent: included in Technical Debt management
- Technical Debt management:
  - Total hours estimated: 10h
  - Total hours spent: 11h10m
  - Hours estimated for remediation by SonarQube: 7h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 3h40m 
  - Hours spent on remediation: 7h30m 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.2%
  - rating for each quality characteristic reported in SonarQube under "Measures":
    - Reliability: A
    - Security: A
    - Maintainability: A

## ASSESSMENT

- What caused your errors in estimation (if any)? 
	+ Some tasks where implemented in an indirect way in the previous sprint. For instance, story 3 was completed adding just a button in the homepage, recycling the ProductList component.

- What lessons did you learn (both positive and negative) in this sprint?
	+ Doing things in the most correct way always pays back. Dedicating a bit more time to details always makes the difference.

- Which improvement goals set in the previous retrospective were you able to achieve? 
	+ We dedicated ourselves into improving the project documentation.
- Which ones you were not able to achieve? Why?
	+ Apparently the time we spent on the documentation wasn't enough. When we were re-reading that, new things to be added came up into our minds. So, since we want to do a good job, we'll keep this as a goal also for next sprint.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
	+ We want to improve code review. We also want to improve our way of testing in order to have a very robust system.

- One thing you are proud of as a Team!!
	+ We trust each other's work, we all know that we're doing the best we can.
