<script>
// Get the elements with class="column"
var elements = document.getElementsByClassName("column");

// Declare a "loop" variable
var i;


// Four images side by side

for (i = 0; i < elements.length; i++) {
    elements[i].style.flex = "25%"; 
}

</script>
