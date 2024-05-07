const langEl = document.querySelector('.langWrap');
const link = document.querySelectorAll('a');
const titleEl = document.querySelector('.title');
const introEl = document.querySelector('.intro');
const abouttitleEl = document.querySelector('.abtitle');
const leadtextEl = document.querySelector('.leadtext');


link.forEach(el => {
    el.addEventListener('click', () => {
        langEl.querySelector('.active').classList.remove('active');
        el.classList.add('active');

        const attr = el.getAttribute('language');

        titleEl.textContent = data[attr].title;
        introEl.textContent = data[attr].intro;
        abouttitleEl.textContent = data[attr].abtitle;
        leadtextEl.textContent = data[attr].leadtext;
        
    });
});



var data = {
    "english": 
    {
      "title": "Hello, I'm Mohamed Doudella",
      "intro": "software Developer",
      "abtitle": "About Me",
      "leadtext": "My name is Mohamed, a passionate backend developer from Utrecht with 4 years of experience. My focus is on building robust software solutions and sharing knowledge to continuously improve them. I enjoy working on large scale projects and have a great passion for learning new technologies. I also love working on my own projects and letting my creativity run wild."
          
    },






    "kazakh": 
    {
      "title": "Сәлем Әлем",
      "description": 
          "Сәбіз Lorem ipsum, жеңілдік. Бұл ауырсыну үшін осы ұннан таңдамаңыз, сондықтан аз Осы ауырсынуды орындаңыз. Қызметтер жоқ және оның айырмашылығын ұлы ыңғайсыздық таңдау, тәжірибе ретінде қабылданған ештеңе өңдеу үшін нәтиже инцидент және қателіктерді зерттеуші ләззат, өмір, encounter born сияқты үлкен тағамдар-бәрі! Осы мәселе бойынша біздің сабоның кейбірін ашу, зерттеуші дұрыс! Дана, біз asperiores туған қызметтер тізімі деді олардың жұмыс, кез келген уақытта, содан бері үлкен жүгірістер, соның ішінде ләззат немесе рахат өңдеу сұраймыз. Қашуға."
    },
    "japanese": 
    {
      "title": "ハロー・ワールド",
      "description": 
          "ﾂつｨﾂ知ﾂづｧﾂつｹﾂ-ﾂ新ﾂ陳ﾂ湘ｮﾂ陛ｱ これらの苦痛から真実の苦痛に選ぶために得てはいけない、従ってより少しにこの苦痛に従ってはいけない。 サービスではないと、彼の区別の大きな不快感から選択するそれらの否認を歓迎しない、結果として生じた事件の喜びと障害エクスプローラが受け入 このことについて私たちの下駄のいくつかを非難,右エクスプローラ! 的に仕事をしていまasperioresリストの生まれのサービスをつけてください編集喜びや楽しみの開催なども走りました。 走れ。."
    }
  }