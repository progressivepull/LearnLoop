$(document).ready(function () {
  console.log("App Started.....");

  let quiz = null;
  let resultConfig = null;
  let resultQuestions = null;
  let currentQuestion = {};
  let current = 0;
  let correct = 0;
  let wrong = 0;
  let answered = false;


  $("#restartBtn").hide();

  $("#quiz-page").hide();
  $("#selectDataFileDialog").hide();
  $("#selectOptionDialog").hide();
  $("#result-page").hide();


  // ================ CONFIGURATION VALIDATE ===================
  function validateConfig(json) {
    const result = {
      hasExamName: false,
      hasLinkBaseUrl : false,
      hasLinkFolderName : false,
      hasLinkFileName : false,
      hasLinkTerms : false,
      hasShuffleQuestions: false,
      hasShuffleOption: false,
      hasTimeLimitMinutes: false

    };

    // Check exam_name
    if (json?.config?.exam_name) {
      result.hasExamName = true;

    }

    // Check link_base_url
    if (json?.config?.link_base_url) {
      result.hasLinkBaseUrl = true;

    }

    // Check link_folder_name
    if (json?.config?.link_folder_name){
      result.hasLinkFolderName = true;

    }

    // Check link_file_name
    if (json?.config?.link_file_name){
      result.hasLinkFileName = true;

    }

    // Check link_terms
    if (json?.config?.link_terms){
      result.hasLinkTerms = true;

    }

    // Check shuffle_questions
    if (typeof json?.config?.shuffle_questions === "boolean") {
      result.hasShuffleQuestions = true;
    }

    // Check shuffle_options
    if (typeof json?.config?.shuffle_options === "boolean") {
      result.hasShuffleOption = true;
    }

    // Check time_limit_minutes
    if (Number.isFinite(json?.config?.time_limit_minutes)) {
      result.hasTimeLimitMinute = true;
    }


    resultConfig = result;
  }


  // ================ QUESTIONS VALIDATE ===================
  function validateQuestions(json) {
    const result = {
      hasId : false,
      hasProblemDescription : false,
      hasQuestion : false,
      hasOptions : false,
      hasAnswer : false,
      hasCode: false
    };

    // Check id
    if (Number.isFinite(json?.questions[current]?.id)) {
      result.hasId = true;
    }

    // Check problem_description
    if (json?.questions[current]?.problem_description) {
      result.hasProblemDescription = true;
    }

    // Check question
    if (json?.questions[current]?.question) {
      result.hasQuestion = true;
    }

    // Check options
    if (json?.questions[current]?.options) {
      result.hasOptions = true;
    }

    // Check answer
    if (json?.questions[current]?.answer) {
      result.hasAnswer= true;
    }

    // Check code
    if (json?.questions[current]?.resource?.code?.lines) {
      result.hasCode = true;
    }

    resultQuestions = result;
  }

  // ================ TOGGLE SCREEN COMPONENTS ===============

  function toggleComponents(componentName){


     //Display only the Start Page
    if(componentName === "START_PAGE"){

      $("#start-page").show();
      $("#quiz-page").hide();
      $("#result-page").hide();


    //Display only the Quiz Page
    }else if (componentName ===  "QUIZ_PAGE"){

      $("#start-page").hide();
      $("#quiz-page").show();
      $("#result-page").hide();


    //Display only the Result Page
    }else if (componentName ===  "RESULT_PAGE"){

      $("#start-page").hide();
      $("#quiz-page").hide();
      $("#result-page").show();

    }



  }

  // ================ PRISM CODE RENDER ======================
  function renderPrismCode(codeObj) {

		  codeObj.lines.unshift({ line: "" });

		  const code = codeObj.lines.map(l => l.line).join("\n");

		  return `<pre class="line-numbers">
						<code class="language-${codeObj.language}">
							${code}
						</code>
					</pre>`;
		}

  // ================= RENDER LINES =========================
  function renderLines(screenComponent, list){

    if (!Array.isArray(list)) {
      screenComponent.html("");   // clear if missing
      return;
    }

    // Join each .line into HTML paragraphs or line breaks
    const html = list
      .map(item => `<div>${item.line}</div>`)
      .join("<br>");

    screenComponent.html(html);

  }


  // ================= LOAD DATA FILE =================
  $("#dataFileInput").on("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);

        // Validate structure
        if (!data.questions || !Array.isArray(data.questions)) {
          console.error("Invalid JSON format: missing 'questions' array");
          return;
        }

        quiz = data;
        console.log("Quiz Loaded:", quiz);

      } catch (err) {
        console.error("Invalid JSON file", err);
      }
    };

    reader.readAsText(file);
  });

  // ================= START =================
  function startQuiz() {
    if (!quiz || !quiz.questions.length) {
      console.warn("No quiz data loaded");
      return;
    }

    current = 0;
    correct = 0;
    wrong = 0;
    answered = false;

    toggleComponents("QUIZ_PAGE");

    loadForm();
  }

  // ================= LOAD FORM =================
  function loadForm() {
    console.log("Form Loaded....");

    $("#restartBtn").show();


    if (!quiz || current >= quiz.questions.length) {
      console.log("Quiz Finished");
      return;
    }


    const quizTitle = $("#quiz-title");
    const questionNo = $("#questionNo");

    validateConfig(quiz);
    console.log(resultConfig);

    console.log("ID : " + current);

    if (resultConfig.hasExamName) {
      quizTitle.html(quiz.config.exam_name);
    }

    // Question Number
    questionNo.html("Question No.  " + quiz?.questions?.[current]?.id);

    validateQuestions(quiz);
    console.log(currentQuestion);

    loadDescriptionQuestion();
    loadCode();
    loadQuestion();
    loadOption();

  }

  // ================= QUIZ STARTED =================
  $("#startBtn").on("click", function () {
    console.log("Quiz Started....");

    if ($("#dataFileInput").val() === "") {

      // Initialize dialog
      $("#selectDataFileDialog").dialog({
        autoOpen: false,
        modal: true,
        title: "Loop Data",
        buttons: {
          "OK": function () {
            $(this).dialog("close");
          }
        }
      });



      $("#selectDataFileDialog").dialog("open");

    } else {
      startQuiz();
    }

  });

  // ================= RESTART QUIZ  =================
  $("#restartBtn").on("click", function () {
    console.log("Quiz Restarted....");

    $("#restartBtn").hide();

    quiz = [];
    current = 0;
    correct = 0;
    wrong = 0;
    answered = false;

    toggleComponents("START_PAGE");

    $("#dataFileInput").val("");


  });




  // ================= QUESTION DESCRIPTION =================
  function loadDescriptionQuestion() {
	  
	const questionDescription = $("#question-description");

    if(resultQuestions.hasProblemDescription){
          
          const desc = quiz?.questions?.[current]?.problem_description;

          renderLines(questionDescription, desc);
    }else{
		$("#question-description").empty();
	}


  }

   // ================= QUESTION ============
  function loadQuestion() {
	  
	const $question = $("#question");

    if(resultQuestions.hasQuestion){
      
      const quest = quiz?.questions?.[current]?.question;

      const total = quiz?.questions?.length;
      const questionCounter = $("#questionCounter");

      answered = false;

      renderLines($question, quest);

      // Counter
      questionCounter.text(`Question ${current + 1} of ${total}`);

      // Process Bar

      let processBarValue = Math.round(((current + 1) / total) * 100);

      let $bar = $("#progressbar");

      $bar.progressbar({
          value: processBarValue
      });


   }else{
	   $question.empty();
   }

  }

  // ================= CODE =================

   function loadCode() {
	   
        const lines = quiz?.questions?.[current]?.resource?.code?.lines;

		// Check if valid array and ALL items are empty strings (safe)
		const allEmpty =
		  Array.isArray(lines) &&
		  lines.length > 0 &&
		  lines.every(item => typeof item === "object" && lines[0].line === "");

		// Hide if:
		// - not an array
		// - OR all lines are empty
		// - OR code shouldn't be shown
		if (!Array.isArray(lines) || allEmpty || !resultQuestions?.hasCode) {
		  $("#prismDiv").hide();
		  return;
		}

		// At this point we have valid, non-empty code
		const question = quiz?.questions?.[current];

		if (question?.resource?.code?.lines?.length > 0) {
		  const codeHTML = renderPrismCode(question.resource.code);
		  $("#prismDiv").html(codeHTML);
		  Prism.highlightAll();
		  $("#prismDiv").show();
		} else {
		  $("#prismDiv").hide();
		}
	

   }
   
   
	   

   //=============== OPTIONS ================

   function loadOption(){


     if(resultQuestions.hasOptions){
        // Options
        $("#options").empty();
        $("#options").show();

        currentQuestion = quiz.questions[current];

        $.each(currentQuestion.options, function (key, value) {

          //console.log( key + ":" + value);

          const btn = $("<button>")
            .addClass("btn btn-outline-primary w-100 text-start mb-2")
            .html(`${key}: ${value}`)
            .on("click", function () {
              selectOption(key, $(this));
            });

          $("#options").append(btn);
        });
    }
   }

 // ================= SELECT =================
  function selectOption(selectedKey, button) {
    if (answered) return;

    answered = true;
    const correctAnswer = quiz.questions[current].answer;

    $("#options button").prop("disabled", true);

    if (selectedKey === correctAnswer) {
      correct++;
      button.removeClass("btn-outline-primary").addClass("btn-success");

      $("#feedback")
        .removeClass()
        .addClass("text-success fw-bold")
        .text("Correct!");
    } else {
      wrong++;
      button.removeClass("btn-outline-primary").addClass("btn-danger");

      // highlight correct answer
      $("#options button").each(function () {
        if ($(this).text().startsWith(correctAnswer)) {
          $(this)
            .removeClass("btn-outline-primary")
            .addClass("btn-success");
        }
      });

      $("#feedback")
        .removeClass()
        .addClass("text-danger fw-bold")
        .text(`Wrong! Correct answer is ${correctAnswer}`);
    }
  }

 // ================= NEXT =================
  $("#nextBtn").on("click", function () {


    if (!answered) {
            // Initialize dialog
      $("#selectOptionDialog").dialog({
        autoOpen: false,
        modal: true,
        title: "Option",
        buttons: {
          "OK": function () {
            $(this).dialog("close");
          }
        }
      });

      $("#selectOptionDialog").dialog("open");


    }else{

          current++;

          if (current < quiz.questions.length) {
            loadForm();
          } else {
            showResult();
          }

    }


  });

  // ================= EXPLANATION LINK =================
  $("#openExplanationBtn").click(function () {

      const linkBaseUrl = quiz?.config?.link_base_url;

      let folderName = quiz?.config?.link_folder_name;
      const linkFolderName = folderName.replace("*", quiz?.questions[current]?.id);

      let fileName = quiz?.config?.link_file_name;
      const linkFileName = folderName.replace("*", quiz?.questions[current]?.id);

      var fullExplanationUrl = linkBaseUrl + "/" + linkFolderName + "/" + linkFileName + ".md";

      // Open in new tab
      window.open(fullExplanationUrl, "_blank");

  });

  // ================= TERM LINK =================
  $("#openTermsBtn").click(function () {

      const linkTermsUrl = quiz?.config?.link_terms;

      var fullTermsUrl = linkTermsUrl + ".md";

      // Open in new tab
      window.open(fullTermsUrl, "_blank");

  });

  // ================= RESULT =================
  function showResult() {

    toggleComponents("RESULT_PAGE");

    const total = quiz.questions.length;
    const percent = ((correct / total) * 100).toFixed(2);

    $("#questionCounter").text("");
    $("#question").text("");
    $("#options").empty();
    $("#feedback").text("");

    $("#result").html(`
      <h2 class="text-center">Quiz Completed 🎉</h2>
      <hr>
      <p><strong>Correct:</strong> ${correct}</p>
      <p><strong>Wrong:</strong> ${wrong}</p>
      <p><strong>Score:</strong> ${percent}%</p>
    `);

  }





});