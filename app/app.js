$(document).ready(function () {
  console.log("App Started.....");

  let quiz = null;
  let resultConfig = null;
  let currentQuestion = {};
  let current = 0;
  let correct = 0;
  let wrong = 0;
  let answered = false;

  $("#quiz-page").hide();
  $("#selectDataFileDialog").hide();

  function validateConfig(json) {
    const result = {
      hasExamName: false,
      hasShuffleQuestions: false,
      hasShuffleOption: false,
      hasTimeLimitMinutes: false

    };

    // Check exam_name
    if (json?.config?.exam_name) {
      result.hasExamName = true;
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

    $("#start-page").hide();
    $("#quiz-page").show();

    loadForm();
  }

  // ================= LOAD FORM =================
  function loadForm() {
    console.log("Form Loaded....");


    if (!quiz || current >= quiz.questions.length) {
      console.log("Quiz Finished");
      return;
    }

    validateConfig(quiz);

    console.log(resultConfig);

    if (resultConfig.hasExamName) {
      $("#quiz-title").html(quiz.config.exam_name);
    }



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


    $("#start-page").show();
    $("#quiz-page").hide();

    $("#dataFileInput").val("");


  });




});