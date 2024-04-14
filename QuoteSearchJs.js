const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const errorMessage = document.getElementById("errorMessage");
const author = document.getElementById("author");
const quote = document.getElementById("random-quote");
async function changeQuote(){
    fetch("https://usu-quotes-mimic.vercel.app/api/random")
    .then(response => response.json())
    .then(resultJson => {
        if (resultJson.author != ""){
            author.innerHTML = "~ " + resultJson.author;
        }
        quote.innerHTML = resultJson.content;
        document.body.appendChild(author);
  }) 
}

searchBar.addEventListener('keypress',key =>{
    if(key.key === "Enter"){
        console.log(searchBar.value);
        if(searchBar.value.length > 0){
            errorMessage.style.display = "none";
            search(searchBar.value.trim());
        }
        else{
            errorMessage.innerText = "You need to provide non-empty input";
            errorMessage.style.display = "block";
        }    
    }
});
searchButton.addEventListener('click',() =>{
    if(searchBar.value.length > 0){
        errorMessage.style.display = "none";
        search(searchBar.value.trim());
    }
    else{
        errorMessage.innerText = "You need to provide non-empty input";
        errorMessage.style.display = "block";
    }    
});
async function search(search){
    
    let query = "https://usu-quotes-mimic.vercel.app/api/search?query=" + search;
    fetch(query)
    .then(response => response.json())
    .then(resultJson => {
        
        if (quote != null && quote.parentNode) {
            document.body.removeChild(quote);
        }
        if (author != null && author.parentNode) {
            document.body.removeChild(author);
        }
        
        clear();
        resultJson.results.forEach(element => {
           if (!document.querySelector('.pinnedQuote[id="' + element._id + '"]')) {
                console.log(element);
                const quoteDiv = document.createElement('div');
                quoteDiv.tabIndex = 0;
                quoteDiv.className = 'quote';
                quoteDiv.id = element._id;
                const quoteContent = document.createElement('p');
                quoteContent.textContent = element.content;
                const author = document.createElement('p');
                author.textContent = element.author;
                quoteDiv.appendChild(quoteContent);
                quoteDiv.appendChild(author);
                document.body.appendChild(quoteDiv);
                quoteDiv.ariaLabel = "Quote by" + element.author;
                quoteDiv.addEventListener('click', function() {
                    pinOrUnpinQuote(quoteDiv);
                });
                quoteDiv.addEventListener('keypress', function(event) {
                    if (event.key === "Enter") {
                      pinOrUnpinQuote(quoteDiv);
                    }
                  });
            }
        });
    })
    .catch(() => {
        errorMessage.innerText = "Input doesn't match any names";
        errorMessage.style.display = "block";
      });
}

function clear(){
    const quotes = document.querySelectorAll('.quote');
    quotes.forEach(quote => {
    document.body.removeChild(quote);
});
}

function pinOrUnpinQuote(quoteDiv){
    if(quoteDiv.className === 'quote'){
        quoteDiv.ariaLabel = "Pinned" + quoteDiv.ariaLabel;
        quoteDiv.className = 'pinnedQuote';
        const firstQuote = document.querySelector(".quote");
        document.body.insertBefore(quoteDiv, firstQuote);

        console.log(firstQuote);  
    }
    else{
        quoteDiv.className = 'quote';
    }
    
}
changeQuote();