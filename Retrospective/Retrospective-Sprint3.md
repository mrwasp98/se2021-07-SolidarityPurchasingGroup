TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done => 6 vs 6
- Total points committed vs done => 31 vs 31
- Nr of hours planned vs spent (as a team) =>  112h vs 110h 40m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Our DoD: A story is done when the backed tests performed by `jest` ends successfully and when the frontend tests performed by `cypress` are correctly completed.
### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    13   |    -   |     40     |       47h    |
| _#1_   |    3    |    5   |   11h30m   |   32h 30m    |
| _#2_   |    3    |    8   |     19h    |    5h 25m    |
| _#3_   |    2    |    5   |   11h30m   |       30m    |
| _#4_   |    3    |    5   |   11h30m   |    8h 05m    |
| _#5_   |    3    |    3   |    7h      |    4h 30m    |
| _#6_   |    3    |    5   |   11h30m   |   12h 40m    |


- Hours per task (average, standard deviation): 3h 40m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 1.02

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 8h
  - Total hours spent: 9h25m
  - Nr of automated unit test cases 
  - Coverage (if available)
- E2E testing:
  - Total hours estimated: 5h
  - Total hours spent: 5h
- Code review 
  - Total hours estimated
  - Total hours spent
- Technical Debt management:
  - Total hours estimated: 10h
  - Total hours spent: 11h10m
  - Hours estimated for remediation by SonarQube: 7h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 3h40m 
  - Hours spent on remediation: 7h30m 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 
	+ Some tasks where implemented in an indirect way in the previous sprint. For instance, story 3 was completed adding just a button in the homepage, recycling the ProductList component.

- What lessons did you learn (both positive and negative) in this sprint?
	+ Doing things in the most correct way always pays back. Dedicating a bit more time to details always makes the difference.

- Which improvement goals set in the previous retrospective were you able to achieve? 
	+ We dedicated ourselves into improve the project documentation.
- Which ones you were not able to achieve? Why?
	+ Apparently the time we spent on the documentation wasn't enough. When we were re-reading that new things to be added came up into our minds. So, since we want to do a good job, we'll keep this as a goal also for next sprint.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
	+ Improve testes by dedicating more time to it, complete the documentation, make the GUI more user-friendly.

- One thing you are proud of as a Team!!
	+ We trust each other's work, we all know that we're doing the best we can.
