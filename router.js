var http = require("http");
var   fs = require("fs");
var url=require('url');
var querystring = require('querystring');
var mensajes = require('./modulos/mensajes');
var data_post_maximo = 8 * 1024 * 1024;
var v_nombres = "";
var v_f_nacimiento = "";
var v_telef = "";
var v_mensaje = "";
var v_correo = "";
var validate = false;

  http.createServer(function(req, res){
     var pathname = url.parse(req.url).pathname;
     if(pathname=='/'){
        fs.readFile('./views/index.html',function(err, html){
        console.log('index');
        res.write(html);
        res.end();
        });
    } else if (pathname=='/nosotros'){
        console.log('nosotros');
        fs.readFile('./views/nosotros.html',function(err, html){
        res.write(html);
        res.end();
        });
    } else if(pathname=='/servicio'){
        console.log('servicio')
        fs.readFile('./views/servicio.html',function(err, html){
        res.write(html);
        res.end();
        });
    } else if (pathname=='/contacto'){
        console.log('contacto')
        fs.readFile('./views/contacto.html',function(err, html){
        res.write(html);
         res.end();    
    });

    } else {

        if(req.method == 'POST'){
              validate = true;
              var data_post = '';
              req.on('data', function(data_cortada){
                 data_post += data_cortada;
                /// imprime la url con el posy console.log("DATA", data_post);
                 if(data_post.length > data_post_maximo){
                    this.pause();
                    res.writeHead(413);
                    res.end('Ha surgido un error y no puede continuarse.');
                 }
              });
              req.on('end', function(){
                 var data_post_objecto = querystring.parse(data_post);
                /// imprime los valores en formato json console.log("DATA 2", data_post_objecto);
                 v_nombres = data_post_objecto.name;
                 v_correo = data_post_objecto.email;
                 v_telef = data_post_objecto.telefono;
                 v_f_nacimiento = data_post_objecto.f_nacimiento;
                 v_mensaje = data_post_objecto.mensaje; 
                        
              });
           }else{
           } 

      if (validate) {

      if(pathname=='/confirmacion'){
        console.log('confirmacion')
        fs.readFile('./views/confirmacion.html',function(err, html){
         var html_string = html.toString();
          html_string = html_string.replace('{nombres}', v_nombres);
          html_string = html_string.replace('{correo}', v_correo); 
          html_string = html_string.replace('{mensaje}', v_mensaje); 
          html_string = html_string.replace('{telefono}', v_telef); 
          html_string = html_string.replace('{f_nacimiento}', v_f_nacimiento); 

         validate = false;
         res.writeHead(200,{'Content-type':'text'});
         res.write(html_string);
         res.end();

        });
    }
} else {

 fs.readFile('./views/error.html',function(err, html){
        res.write(html);
         res.end();    
});

}
    }

    // carga de favicon 
   if (req.url === '/favicon.ico'){
      console.log("El manejador de solicitudes 'favicon' fue invocado.");
 
      var img = fs.readFileSync('./favicon.ico');
      res.writeHead(200, {"Content-Type": "image/x-icon"});
      res.end(img,'binary');
   }



  }).listen(3000, function(){
    console.log("Servidor en ejecucion...")
});
