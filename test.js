let json;

//json
async function getContent(){
  let response = await fetch('feed.json',{
    method: 'GET',
  });
  json = await response.text();
  return json;
}
getContent().then(data =>{
  //Исключить спец. символы
  function jsonEscape(jsonString) {
    return jsonString.replace(/\n/g, " ").replace(/\s+/g,' ');
  }

  let arr = JSON.parse(jsonEscape(json));

  //добавление элемента на страницу
  new Vue({
    el: '#app',
    data:{
      lines:[
        {
          date: new Date(arr[0].date),
          author: arr[0].authorName,
          url: arr[0].authorUrl,
          content: arr[0].content,
        }
      ],
    },
    methods:{
      addType(){
        //Обернуть искомые элементы в <span>
        for(let a = 1; a < arr.length; a++){
          this.lines.push({date : new Date(arr[a].date) + ' / ', author : arr[a].authorName + ' / ', url : arr[a].authorUrl, content: arr[a].content})
        }
      },
      wrap(){
        
      }
    },
    beforeMount(){
      this.addType();
      this.wrap();
    },
  })

  //оборачивание элементов в тег
  {
    let cont = document.getElementById('app').querySelectorAll("p");
  
    for(let a = 0; a < arr.length; a++){
      let content = arr[a].content;
      let letLength = 0;
      for (let k = 0; k < arr[a].contentPostTones.length; ++k){
        let tone = arr[a].contentPostTones[k].tone;
        let start = arr[a].contentPostTones[k].position + 22 * k + letLength;
        //оборачиваемый элемент
        let color = content.substr(arr[a].contentPostTones[k].position, arr[a].contentPostTones[k].length)
  
        String.prototype.replaceAt = function(index, replacement) {
          return this.substr(0, index) + replacement + this.substr(index + color.length);
        }
  
        cont[a].innerHTML = cont[a].innerHTML.replaceAt(start, `<span class="${tone}">${color}</span>`);
        letLength = letLength + tone.toString().length;
      }
    }
  }
})

