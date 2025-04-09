<?php

// $WEEK = "<h1>Week NRWEEK</h1>";

$LISTDATES = array("Feb 1","Feb 8","Feb 15","Feb 21","March 1","March 8","March 15","March 21","April 1","April 8","April 15","April 21");

$NRWEEKS = count($LISTDATES);

// $DATE = "<h2>DATE</h2>";

$LISTTOPICS= array("Installation","Html","Css","Javascript 1","","","","","","","","","");

// $TOPIC ="<h3>TOPIC</h3";

$LISTDESCRIPTIONS=array("We install software","We make our first Html","We style pages with Css","Get started on Javascript ","","","","","","","","","");

?>

<html>
<head>

</head>
<body>

<!-- <?php echo "NRWEEKS=".$NRWEEKS."<br>"; ?> -->

<?php for ( $i=0; $i <= $NRWEEKS; $i++){ ?>
<div>
	<h1>Week <?= $i+1 ?> <h1>
	<h2>Date: <?= $LISTDATES[$i] ?> </h2>
	<h3>Topic: <?= $LISTTOPICS[$i]  ?></h3>
	<h4>Description: " <?= $LISTDESCRIPTIONS[$i] ?> "</h4>
</div>
<?php	}?>
	
</body>
</html>