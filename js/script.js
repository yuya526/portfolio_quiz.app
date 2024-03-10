// グローバル空間に変数や関数をセットしないために、即時関数で閉じ込める
(() => {
  // API
  const API_URL = 'https://opentdb.com/api.php?amount=10&category=21';

  // - 問題、問題数、正答数を入れるオブジェクト
  const gameState = {
    quizzes: [],
    currentIndex: 0,
    currentOfCorrects:0
  };

  const questionElement = document.getElementById('question');
  const answersContainer = document.getElementById('answers');
  const resultElement = document.getElementById('result');
  const restartButton = document.getElementById('restart-button');


  // イベント処理の追加
  window.addEventListener('load', (event) => {
    getsQuizData();
  });

  restartButton.addEventListener('click', (event) => {
    getsQuizData();
  });


  /* ----------------------------------
    getsQuizData関数
----------------------------------- */
  //   - Webページ上の表示をリセットする
  //   - クイズ取得

  const getsQuizData = () => {
    questionElement.textContent = 'Now loading...';
    resultElement.textContent = '';
    restartButton.hidden = true;

    fetch(API_URL)
      .then( res => res.json())
      .then((data) => {
        gameState.quizzes = data.results;
        gameState.currentIndex = 0;
        gameState.numberOfCorrects = 0;
        setNextQuiz();
      });
  };

  /* ----------------------------------
    getsQuizData関数
  ----------------------------------- */
    // - 表示要素をリセットする
    // - 条件に応じて、次の問題の表示 or 結果を表示する
 
  const setNextQuiz = () => {
    questionElement.textContent = '';
    removeAllAnswers();

    if(gameState.currentIndex < gameState.quizzes.length){
      // 次のクイズ出題
      console.log('次の問題出題');
      const quiz = gameState.quizzes[gameState.currentIndex];
      makeQuiz(quiz);
    } else{
      // 結果画面の出題
      console.log('終了');
      finishQuiz();
    }
  };


  /* ----------------------------------
    finishQuiz関数
  ----------------------------------- */
  // 正解数を表示
  const finishQuiz = () => {
    resultElement.textContent = `${gameState.numberOfCorrects}/${gameState.quizzes.length}問正解しました！`;
    restartButton.hidden = false;
  };

  /* ----------------------------------
    removeAllAnswers関数
  ----------------------------------- */
  const removeAllAnswers = () => {
    while(answersContainer.firstChild) {
      answersContainer.removeChild(answersContainer.firstChild);
    }
  };

  /* ----------------------------------
    makeQuiz関数
  ----------------------------------- */
  const makeQuiz = (quiz) => {
    // クイズ出題
    const answers = buildAnswers(quiz);
    questionElement.textContent = unescapeHTML(quiz.question);
    console.log('答え :',quiz.correct_answer);

    // 回答一覧実装
    answers.forEach( (value,index) => {
      const liElement = document.createElement('li');
      liElement.textContent = unescapeHTML(value);
      answersContainer.appendChild(liElement);

      liElement.addEventListener('click' , (event) => {
        const correctAnswer = unescapeHTML(quiz.correct_answer);
        if(correctAnswer === liElement.textContent){
          gameState.numberOfCorrects++;
          alert('正解です!!');
        } else{
          alert(`残念... (正解は... "${correctAnswer}"です。)`);
        }

        gameState.currentIndex++;
        setNextQuiz();
      });
    });
  };

  // 正解・不正解の解答をシャッフル
  const buildAnswers = (quiz) => {
    const answer = [
      quiz.correct_answer,
      ...quiz.incorrect_answers
    ];

    return shuffle(answer);
  };


  /* ----------------------------------
    shuffle関数
  ----------------------------------- */
  //  参考サイト
  //     - https://chooblarin.github.io/post/array-shuffle
  //     - https://qiita.com/wwwww/items/8da7e89d64a86809fb0c

  const shuffle = (array) => {
    const copiedArray = array.slice();
    for(i = copiedArray.length-1; i > 0 ;i--){
    j = Math.floor(Math.random()*(i+1));
    tmp = copiedArray[i];
    copiedArray[i] = copiedArray[j];
    copiedArray[j] = tmp;
    }
    return copiedArray;      
  };

  
  /* ----------------------------------
    unescapeHTML関数
  ----------------------------------- */
  //  参考にしたサイト : http://blog.tojiru.net/article/211339637.html

  function unescapeHTML(str) {
    const div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
                       .replace(/>/g,"&gt;")
                       .replace(/ /g, "&nbsp;")
                       .replace(/\r/g, "&#13;")
                       .replace(/\n/g, "&#10;");
    return div.textContent || div.innerText;
  };

})();