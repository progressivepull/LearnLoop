$( document ).ready(function() {
  console.log("App Started.....");


    let quiz = [];
    let currentQuestion = {};
    let current = 0;
    let correct = 0;
    let wrong = 0;
    let answered = false;
	
	$("#codeDiv").hide();
	$("#nextBtn").hide();
	$("#restartBtn").hide();

    // ================= LOAD FILE =================
      $("#fileInput").on("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const data = JSON.parse(e.target.result);
            quiz = data;
            startQuiz();
      };

      reader.readAsText(file);
	  
      });

    // ================= START =================
    function startQuiz() {
        current = 0;
        correct = 0;
        wrong = 0;
		
		hideComponents(true);

        loadForm(); 

    }

    // ================= LOAD FORM =================
    function loadForm(){

        currentQuestion = quiz[current];

        loadQuestion();

        if(currentQuestion.code !== "" && currentQuestion.language !== ""){
          loadCode();
        }

        if(currentQuestion.description_question !== ""){
          loadDescriptionQuestion()
        }else{
          $("#description-question").text("");
        }
		
		$("#nextBtn").show();
		$("#restartBtn").show();
		

    }



   // ================= LOAD QUESTION =================
    function loadQuestion() {
      answered = false;
      $("#feedback").text("");
      $("#result").text("");

      const total = quiz.length;
	  const question = $("#question");
	  const questionCounter = $("#questionCounter");
	  
	  question.show();
	  questionCounter.show();

      // Counter
      questionCounter.text(`Question ${current + 1} of ${total}`);

      // Question
      question.html(currentQuestion.question);

      // Options
      $("#options").empty();
	  $("#options").show();

      $.each(currentQuestion.options, function (key, value) {
        const btn = $("<button>")
          .addClass("btn btn-outline-primary w-100 text-start mb-2")
          .html(`${key}: ${value}`)
          .on("click", function () {
            selectOption(key, $(this));
          });

        $("#options").append(btn);
      });
    }

   // ================= LOAD CODE =================
    function loadCode() {
		
		
	  $("#codeDiv").show();

      const codeBlock = $("#codeBlock");

      codeBlock.text(currentQuestion.code);
      codeBlock.attr("class", "language-" + currentQuestion.language);

      Prism.highlightElement(codeBlock[0]);


    }

  // ================= LOAD DESCRIPTION OR QUESTION =================
    function loadDescriptionQuestion(){
		
	  const descriptionQuestion = $("#description-question")
	  
      descriptionQuestion.show();
      descriptionQuestion.html(currentQuestion.description_question);

    }

 // ================= SELECT =================
  function selectOption(selectedKey, button) {
    if (answered) return;

    answered = true;
    const q = quiz[current];
    const correctAnswer = q.answer;

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
      alert("Please select an option!");
      return;
    }

    current++;

    if (current < quiz.length) {
      loadForm();
    } else {
      showResult();
    }
  });

  // ================= REMOVE FORM COMPONENT =================
  function hideComponents(stateHide) {

      if(stateHide){
        $("#fileInputDiv").hide();
        $("#questionCounter").hide();
        $("#question").hide();
        $("#codeDiv").hide();
        $("#description-question").hide();
        $("#options").hide();
        $("#nextBtn").hide();
      }else{
        $("#fileInputDiv").show();
        $("#questionCounter").show();
        $("#question").show();
        $("#codeDiv").show();
        $("#description-question").show();
        $("#options").show();
        $("#nextBtn").show();
      }
  }



  // ================= RESULT =================
  function showResult() {

    hideComponents(true);

    const total = quiz.length;
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

  // ================= RESTART =================
  $("#restartBtn").on("click", function () {
    quiz = [];
    current = 0;
    correct = 0;
    wrong = 0;
    answered = false;

    hideComponents(true);
	
	$("#fileInputDiv").show();
    $("#fileInput").val("");
	
	$("#restartBtn").hide();
	
    alert("Quiz reset. Please select a file.");
  });


});