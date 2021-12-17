RETROSPECTIVE (Team 07)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done : 5 vs 4
- Total points committed vs done: 42 vs 37
- Nr of hours planned vs spent (as a team): 112h vs 108h 15m 

**Remember**  a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Our DoD: A story is done when the backed tests performed by `jest` ends successfully and when the frontend tests performed by `cypress` are correctly completed.

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    14   |    -   |      40h   |     56h30m   |
|*#5*    |     3   |   3    |      5h    |     4h30m    |
|*#6*    |     3   |   5    |      9h    |     11h50m   |
|*#7*    |     3   |  21    |      36h   |     9h30m    |
|*#8*    |     3   |   8    |      13h   |     26h50m   |
|*#9*    |     3   |   5    |      9h    |      0h      |

- Hours per task (average, standard deviation): 3h 43m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 1,03

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 9h (backend)
  - Total hours spent: 4h30m (backend)
  - Nr of automated unit test cases: 49 (backend)
  - Coverage: 79.9% (backend)
- E2E testing:
  - Total hours estimated: 8h
  - Total hours spent: 9h30m
- Code review 
  - Total hours estimated: included in Technical Debt management
  - Total hours spent: included in Technical Debt management
- Technical Debt management:
  - Total hours estimated: 5h
  - Total hours spent: 11h55m
  - Hours estimated for remediation by SonarCloud: 5h
  - Hours estimated for remediation by SonarCLoud only for the selected and planned issues: 3h 
  - Hours spent on remediation: 10h
  - debt ratio: 2.3% (with cypress reports analysis included)
  - rating for each quality characteristic reported in SonarQube under "Measures" (before including cypress reports analysis) : 
    - Reliability: A
    - Security: A
    - Maintainability: A 
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  We thought that the price to pay for skipping the technical debt would have been way less. This caused us not to finish the last story.
  The other error was in story 3 because we estimated it to be very difficult but was assigned to a person that had experience. So it took less than expected.

- What lessons did you learn (both positive and negative) in this sprint?
  We learnt that it's important to progess with technical debt in a parallel way with the coding. We should never let the coding surpass the technical debt management.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  We managed to both improve technical debt management and code revision.
  
- Which ones you were not able to achieve? Why?
  None.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  We want to get better at writing the documentation for our project. 

- One thing you are proud of as a Team!!
  In the last sprint the cooperation increased a lot! We always strive to do our best to be statisfied of our work.
