import { TaskRequest, TaskAnswer } from "../interfaces";

onmessage = function( event ){
    postMessage( computeRow( event.data as TaskRequest ) );
}

function computeRow( task: TaskRequest ): TaskAnswer{
    let answer: TaskAnswer = {
        row: task.row,
        values: []
    };
    
    var iter = 0;
	var c_i = task.i;
	var max_iter = task.max_iter;
	var escape = task.escape * task.escape;
	
	// Fuer die komplette Zeile
	for (var i = 0; i < task.width; i++)
	{
		//c_r = a
		var c_r = task.r_min + (task.r_max - task.r_min) * i / task.width;
		//z_r = xn
		var z_r = 0;
		//z_i = yn
		var z_i = 0;

		// Wiederholen solange die maximale Anzahl an Iterationen nicht erreicht ist und
		// x^2 + y^2 < als die festgelegte Escape-Zahl ist
		for (iter = 0; z_r * z_r + z_i * z_i < escape && iter < max_iter; iter++)
		{
			// xn+1 = xn^2 - yn^2 + a
			// yn+1 = 2*xn*yn + b
			var tmp = z_r * z_r - z_i * z_i + c_r;
			z_i = 2 * z_r * z_i + c_i;
			z_r = tmp;
		}// end for
		
		// Pruefen, ob maximale Iterationszahl erreicht wurde
		// wenn ja, iter auf -1 setzen (Punkt ist in der Mandelbrotmenge)
		// wenn nein, iter so lassen (Punkt geh�rt nicht zur Mandelbrotmenge)
		if (iter == max_iter)
		{
			iter = -1;
		}// end if
		
		// iter zum Values-Array hinzuf�gen
		answer.values.push(iter);
	}
	return answer;
}