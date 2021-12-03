TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 6 vs
- Total points committed vs done 31 vs
- Nr of hours planned vs spent (as a team) 112 vs

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |         |    -   |     40     |              |
| _#1_   |         |    5   |   11h30m   |              |
| _#2_   |         |    8   |     19h    |              |
| _#3_   |         |    5   |   11h30m   |              |
| _#4_   |         |    5   |   11h30m   |              |
| _#5_   |         |    3   |    7h      |              |
| _#6_   |         |    5   |   11h30m   |              |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases 
  - Coverage (if available)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review 
  - Total hours estimated 
  - Total hours spent
- Technical Debt management:
  - Total hours estimated 
  - Total hours spent
  - Hours estimated for remediation by SonarQube
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 
  - Hours spent on remediation 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

- What lessons did you learn (both positive and negative) in this sprint?

- Which improvement goals set in the previous retrospective were you able to achieve? 
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

> Propose one or two

- One thing you are proud of as a Team!!