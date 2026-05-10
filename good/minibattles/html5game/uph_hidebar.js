function hideAddressBar()
{
    var cnvContainer = document.getElementById('gm4html5_div_id');    
    
    if (cnvContainer.style.height < window.outerHeight + 200)
        cnvContainer.style.height = (window.outerHeight + 200) + "px";
        
    setTimeout(function()
    { 
        window.scrollTo(0, 1);
    }, 50);      
}