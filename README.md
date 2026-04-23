# LearnLoop       

[LearnLoop](https://progressivepull.github.io/LearnLoop/)

**✅ High‑Level Description of app.js**

Your script implements a **fully client‑side quiz engine** using jQuery.
It loads a JSON file, validates its structure, displays questions,
handles answers, tracks score, and shows results.

The flow is:

1.  **Load JSON quiz file**

2.  **Validate config + question structure**

3.  **Render question, description, code, options**

4.  **Handle answer selection**

5.  **Navigate Next → Next → Result**

6.  **Show score summary**

7.  **Restart quiz**

**🧠 Core Components Explained**

**1. Initialization**

- Hides all pages except the start page.

- Prepares variables: quiz, current, correct, wrong, answered, etc.

- Sets up event listeners for:

  - Start button

  - Restart button

  - Next button

  - File input

  - Explanation / Terms links

**2. Quiz JSON Loading**

Triggered when user selects a file:

- Reads file via FileReader

- Parses JSON

- Ensures questions array exists

- Stores quiz data in quiz

If JSON is invalid → logs an error.

**3. Validation Logic**

Two validators:

**A. Config Validator**

Checks presence of:

- exam name

- link URLs

- shuffle flags

- time limit

Stores results in resultConfig.

**B. Question Validator**

Checks for:

- id

- problem description

- question text

- options

- answer

- code block

Stores results in resultQuestions.

**4. Screen Navigation**

The function toggleComponents() switches between:

- **START_PAGE**

- **QUIZ_PAGE**

- **RESULT_PAGE**

Only one is visible at a time.

**5. Rendering Question Content**

**A. Description**

If present, uses renderLines() to display multi‑line text.

**B. Question Text**

Also uses renderLines().

**C. Code Block**

If present:

- Builds PrismJS \<pre\>\<code\> block

- Calls Prism.highlightAll()

**D. Options**

Creates a button for each option:

Code

A: Option text

B: Option text

...

Clicking triggers selectOption().

**6. Answer Selection**

When user clicks an option:

- Prevents double‑answering

- Compares selected key to correct answer

- Marks button green (correct) or red (wrong)

- Highlights correct answer if user was wrong

- Updates counters

- Shows feedback message

**7. Next Button Logic**

If user clicks **Next** without answering:

- Opens a jQuery UI dialog: “Select an option”

If answered:

- Moves to next question

- If no more questions → calls showResult()

**8. Explanation & Terms Links**

Builds URLs using config:

- link_base_url

- link_folder_name (with \* replaced by question ID)

- link_file_name

- link_terms

Opens .md files in a new tab.

**9. Result Page**

Displays:

- Correct count

- Wrong count

- Percentage score

Clears question UI.

**10. Restart Logic**

Resets everything:

- Clears quiz data

- Resets counters

- Hides restart button

- Returns to start page

- Clears file input

**🧩 Overall Architecture Summary**

| **Component**         | **Purpose**                               |
|-----------------------|-------------------------------------------|
| **validateConfig**    | Ensures config fields exist               |
| **validateQuestions** | Ensures each question has required fields |
| **toggleComponents**  | Controls page visibility                  |
| **renderLines**       | Renders multi‑line text blocks            |
| **renderPrismCode**   | Renders syntax‑highlighted code           |
| **loadForm**          | Loads everything for the current question |
| **selectOption**      | Handles answer checking                   |
| **showResult**        | Displays final score                      |
