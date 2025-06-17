# Star Player Dependency Analyzer

A web application to help sports teams and organizations assess their reliance on key individuals and develop strategic resilience.

## Overview

The Star Player Dependency Analyzer is a tool designed to help sports teams (or any organization) assess how dependent they are on key individuals across various performance areas. The application calculates a "dependency score" based on user inputs and provides recommendations for mitigating risks associated with over-reliance on star players or key personnel.

### Key Features

- **Multi-Factor Assessment**: Evaluate dependency across different performance areas (scoring, leadership, fan engagement, etc.)
- **Customizable Weights**: Adjust the importance of each factor based on organizational priorities
- **Risk Visualization**: Visual representation of dependency risk by area and individual
- **Strategic Recommendations**: AI-generated suggestions for reducing dependency and building resilience
- **Simple Data Management**: Save and export assessment results

## Problem Being Solved

Many sports teams and organizations become overly dependent on star players or key individuals, which creates significant risk if those individuals become unavailable (through injury, transfer, retirement, etc.). This tool helps organizations:

1. Identify where their greatest dependencies exist
2. Quantify the risk associated with those dependencies
3. Develop strategies to build organizational resilience

## Technical Implementation

### Architecture

The application follows a simple client-side architecture:

- **Frontend**: HTML5, CSS3 (Bootstrap 5), JavaScript (ES6+)
- **Data Visualization**: Chart.js for dependency radar charts and risk scores
- **Data Storage**: Local browser storage for saving assessments
- **Deployment**: GitHub Pages for hosting

### Key Components

1. **Assessment Form**: Input interface for rating player importance across different areas
2. **Calculation Engine**: JavaScript functions to process inputs and calculate dependency scores
3. **Visualization Module**: Chart generation for dependency visualization
4. **Recommendation Engine**: Rule-based system for generating strategic suggestions
5. **Data Management**: Local storage implementation for saving and loading assessments

## User Flow

1. User enters organization/team name and creates profiles for key individuals
2. For each individual, user rates their importance (1-10) across different performance areas
3. User assigns weights to each performance area based on organizational priorities
4. Application calculates dependency scores and generates visualization
5. Application provides strategic recommendations for reducing high-dependency risks
6. User can save assessment and export results

## Setup and Installation

1. Clone this repository
2. Open `index.html` in your browser
3. No build process or server required - this is a fully client-side application

## Future Enhancements

- Team comparison feature to benchmark against other organizations
- Historical tracking to monitor dependency changes over time
- Integration with performance data APIs for automated scoring
- Advanced scenario planning tools

## License

MIT License

## Contact

For questions or feedback, please open an issue on this repository.