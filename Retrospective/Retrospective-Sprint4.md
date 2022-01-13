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
- Nr of hours planned vs spent (as a team) =>  112h vs 108h55m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Our DoD: A story is done when the backed tests performed by `jest` ends successfully and when the frontend tests performed by `cypress` are correctly completed.
### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    12   |    -   |    40h     |     73h35m	|
| _#40_  |    1    |    13  |    26h     |     7h30m	|
| _#41_  |    3    |    5   |    10h     |   7h 25m     |
| _#42_  |    3    |    8   |    16h     |   7h 40m     |
| _#43_  |    1    |    5   |    10h     |   6h 45m     |
| _#15_  |    3    |    5   |    10h     |       6h     |


- Hours per task (average, standard deviation): 4h43m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 0,97

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 8h
  - Total hours spent: 6h20m
  - Nr of automated unit test cases: 91 (backend)
  - Coverage (if available): 76.44% (jtest), 78% (cypress)
- E2E testing:
  - Total hours estimated: 5h
  - Total hours spent: 4h20m
- Code review 
  - Total hours estimated: included in Technical Debt management
  - Total hours spent: included in Technical Debt management
- Technical Debt management:
  - Total hours estimated: 10h
  - Total hours spent: 34h30m
  - Hours estimated for remediation by SonarQube: 7h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 5h30m
  - Hours spent on remediation: 29h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.2%
  - rating for each quality characteristic reported in SonarQube under "Measures":
    - Reliability: A
    - Security: A
    - Maintainability: A

## ASSESSMENT

- What caused your errors in estimation (if any)? 
	+ We thought Telegram bot development and report development would be very challenging, but it wasn't the case.

- What lessons did you learn (both positive and negative) in this sprint?
	+ It's dangerous not to keep in mind the general flow of the project, not only thinking about completing stories per se. Some changes were required in the implementation of  past stories, in order to support added functionalities.

- Which improvement goals set in the previous retrospective were you able to achieve? 
	+ Improve code review and our way of testing.
	
- Which ones you were not able to achieve? Why?
	+ Sadly, even if we put our effort in testing, our system has not managed to be very robust (a bug was found before the demo and we were not able to resolve it in time).

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
	+ Be mindful of the general flow of the project.

- One thing you are proud of as a Team!!
	+ We never leave things unfinished, if there is a problem in sight we are ready to solve it by hook or by crook!
