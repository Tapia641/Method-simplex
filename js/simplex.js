 function jsimplex(div)
 {
     this.novariables=0;
     this.norestricciones=0;
     this.noxs=0;
     this.noss=0;
     this.noas=0;
     this.ntotal=0;   
     this.problema = new Array();
     this.a = new Array(); //matriz de las restricciones
     this.c= new Array(); //función objetivo
     this.base= new Array();
     this.theta=new Array();
     this.zeta =new Array();
     this.documentar = false;
     this.maximizar = true;
     this.varsaliente=0;
     this.varentrante =0;
     this.tiposolucion = 1;
     //
         
     jsimplex.prototype.normalizar=function()
     {
         var i=0;
         var j=0;
         var is=0;
         var ia=0;
         var s="";
         
        try
        {
            this.noxs= this.novariables;
            for (i=1; i<= this.norestricciones; i++)
            {
               switch (this.problema[i][this.noxs+1])
               {
                   case "<=":
                       this.noss=this.noss+1;                  
                       break;
                   case ">=":
                       this.noss++;
                       this.noas++;
                       break;
                   case "=":
                       this.noas++;
                       break;
               }
            }
            
            this.ntotal = this.noxs+ this.noss + this.noas;
            this.a = new Array(this.norestricciones+1);
            this.base= new Array(this.norestricciones);
            this.zeta= new Array(4);
            for (i=0; i<=4; i++)
            {
                this.zeta[i]=new Array(this.ntotal+1);
            }
            
            for (i=0; i<= this.norestricciones+1; i++)
            {
                this.a[i]= new Array(this.ntotal+1);
            }
            this.c = new Array(2);
            for (i=0; i<=3; i++)
            {
                this.c[i]= new Array(this.ntotal);
            }
            //inicialicemos
            for (i=0; i<=this.ntotal; i++)
            {
                this.c[0][i]=""; //Nombre de la variable...
                this.c[1][i]=0; //valor de la variable en numeros
                this.c[2][i]=0; //Valor del coeficiente de la M, si lo hay...
                this.c[3][i]=0; //El tipo de variable...
            }
            

            for (i=1; i <= this.norestricciones; i++)
            {
                for (j=1;j<=this.noxs;j++)
                {
                    this.a[i][j]= this.problema[i][j];
                }
                switch (this.problema[i][this.noxs+1])
                {
                    case "<=":
                        is++;                     
                        for (j=1; j<=this.noss; j++)
                        {
                            if (is==j)
                            {
                                this.a[i][this.noxs+j]=1;
                                this.base[i]=this.noxs+j;
                            }else
                            {
                                this.a[i][this.noxs+j]=0;
                            } 
                        }
                        if (this.noas >=1)
                        {
                                for (j=1; j<=this.noas; j++)
                               {
                                   this.a[i][this.noxs+ this.noss + j]=0;
                               }   
                        }
                        
                        break;
                    case ">=":
                        is++;
                        ia++;
                        for (j=1; j<=this.noss; j++)
                        {
                            if (is==j)
                            {
                                this.a[i][this.noxs+j]=-1;                             
                            }else
                            {
                                this.a[i][this.noxs+j]=0;
                            } 
                        }
                        for (j=1; j<=this.noas; j++)
                        {
                            if (ia==j)
                            {
                                this.a[i][this.noxs+this.noss+j]=1;
                                this.base[i]=this.noxs+this.noss+j;
                            }else
                            {
                                this.a[i][this.noxs+this.noss+j]=0;
                            } 
                        }                     
                        break;
                    case "=":
                        ia++;
                        for (j=1; j<=this.noss; j++)
                        {
                            this.a[i][this.noxs+j]=0;                          
                        }
                        for (j=1; j<=this.noas; j++)
                        {
                            if (ia==j)
                            {
                                this.a[i][this.noxs+this.noss+j]=1;
                                this.base[i]= this.noxs+this.noss+j;
                            }else
                            {
                                this.a[i][this.noxs+this.noss+j]=0;
                            } 
                        }
                }
                this.a[i][this.noxs+ this.noss+ this.noas+1]= this.problema[i][this.novariables+2];             
            }
            //llenar la función objetivo...
             for (i=1; i<=this.noxs; i++)
            {
                this.c[0][i] = this.a[0][i];
            }
            
            s="<Table border='1'>";
            for (i=1; i <= this.norestricciones; i++)
            {
                s=s + "<tr>";   
                for (j=1; j<=this.noxs; j++)
                {
                    if (this.a[i][j]!= 0)
                    {
                        s=s + "<td>+"+this.a[i][j]+"X<sub>"+j+"</sub><td>";
                    }else
                    {
                        s=s + "<td><td>";
                    }   
                }
                for (j=1; j<=this.noss; j++)
                {
                    if (this.a[i][this.noxs + j]!= 0)
                    {
                        s=s + "<td>+"+this.a[i][this.noxs + j]+"S<sub>"+j+"</sub><td>";
                    }else
                    {
                        s=s + "<td><td>";
                    }    
                }
                for (j=1; j<=this.noas; j++)
                {
                    if (this.a[i][this.noxs + this.noss + j]!= 0)
                    {
                        s=s + "<td>+"+this.a[i][this.noxs + this.noss +   j]+"A<sub>"+j+"</sub><td>";
                    }else
                    {
                        s=s + "<td><td>";
                    }    
                }
               s=s + "<td>=<td>";
               s=s + "<td>"+this.a[i][this.ntotal+1]+"<td>";
               s=s + "</tr>";
            }
            s=s + "</table>";
            s= s +"<br>";
            s= s+ "<br>";
            s= s+ "<table border='1'>";            
            for (i=1; i<= this.norestricciones;  i++)
            {
                s= s+ "<tr>";
                for (j=1; j<=this.ntotal+1; j++ )
                {
                    s= s+ "<td>"+this.a[i][j]+"</td>";
                }
                s= s+ "</tr>";
            }
            s= s+ "</table>";
            
             //Llenar los coeficientes de la funcion objetivo...
             for (i=1; i<= this.ntotal; i++)
             {
                 //llenar los nombres...
                 if (i<= this.noxs)
                 {
                     this.c[0][i]="<b>X</b><sub>"+i+"</sub>";
                     this.c[3][i]=1; //Variables de decision 1
                 }
                 if (i>=this.noxs+1 && i<= this.noxs+ this.noss  )
                 {
                     this.c[0][i]="<b>Holgura</b> "+(i-this.noxs)+"</sub>";
                     this.c[3][i]= 2; //Variables de holhura y superavit
                 }
                 if (i>=(this.noxs+this.noss +  1) )
                 {
                     this.c[0][i]="<b>Artificial</b> "+(i-this.noxs-this.noss)+"</sub>";
                     this.c[3][i]=3;// Variables artificiales...
                     if (this.maximizar)
                     {
                        this.c[2][i]=-1;
                     }else
                     {
                         this.c[2][i]=1;
                     }
                 }
                 //Llenar los coeficientes númericos...
                 if (i<= this.noxs)
                 {
                     this.c[1][i]=this.problema[0][i];
                 }
                 if (i>=this.noxs+1 && i<= this.noxs+ this.noss + this.noas  )
                 {
                     this.c[1][i]=0;
                 }
                 
             }
            
            
            //documentar...
            var smodelo="";
            if (this.documentar)
            {
                smodelo = "<br><table>";
                smodelo = smodelo +"<tr>";
                //documentar la función objetivo....
                smodelo = smodelo +"<td><b>"+(this.maximizar?"Max Z = ":"Min Z = ")+"</b></td>";
                for (i=1; i<=this.noxs+this.noss; i++)
                {
                    if (i==1)
                    {
                        smodelo = smodelo +"<td>"+     this.c[1][i] + this.c[0][i]+"</td>";
                    }else
                    {
                        smodelo = smodelo +"<td>"+(this.c[1][i]>=0?"+":"" )+ this.c[1][i] + this.c[0][i]+"</td>";
                    }    
                    
                }
                for (i=(this.noxs+this.noss+1); i<=this.ntotal; i++)
                {                    
                    smodelo = smodelo +"<td>"+(this.c[2][i]>=0?"+":"" ) +this.c[2][i]+"M"+this.c[0][i]+"</td>";
                }
                smodelo = smodelo +"</tr>";
                smodelo = smodelo +"<tr><td>Sujeto a:</td></tr>";
                for (i=1; i<= this.norestricciones; i++)
                {
                    smodelo = smodelo +"<tr>";
                    smodelo = smodelo +"<td></td>";
                    for (j=1; j<=this.ntotal; j++)
                    {
                        if (this.a[i][j]!= 0)
                        {
                            if (j>1)
                            {
                                smodelo = smodelo +"<td>"+(this.a[i][j]>0?"+":"")+  this.a[i][j]+this.c[0][j]+"</td>";    
                            }else
                            {
                                smodelo = smodelo +"<td>"+ this.a[i][j]+this.c[0][j]+"</td>";
                            }    
                            
                        }else
                        {
                            smodelo = smodelo +"<td></td>";
                        }    
                        
                    }
                    smodelo = smodelo +"<td> = </td>";
                    smodelo = smodelo +"<td>"+ this.a[i][this.ntotal+1]   +"</td>";
                    smodelo = smodelo +"</tr>";
                }
                smodelo = smodelo +"<tr><td>Xi>=0</td></tr>";
                smodelo = smodelo +"</table><br>";
                smodelo = smodelo +"Xi = Variables de decisi&oacute;n<br> Si = Variables de holgura o super&aacute;vit <br>Ai = Variables artificiales ";
                document.getElementById(div).innerHTML = document.getElementById(div).innerHTML  + smodelo;
            }
        }catch(err)
        {
            alert("Error :"+err.message);
        }
         return s;
     }
     jsimplex.prototype.calcularzeta=function()
     {
         try
         {
         //Fila 1: Zeta Numeros
         //Fila 2: Zeta M
         //Fila 3: C - Z Numeros
         //Fila 4: C - Z M
         var suma=0;
         var sumam=0;
         var coef=0;
         var coefm=0;
         for (j=1; j<= this.ntotal+1; j++)
         {
             suma=0;
             sumam=0;
             for (i=1; i<=this.norestricciones; i++)
             {
                 coef= this.c[1][this.base[i]];
                 coefm= this.c[2][this.base[i]];
                 suma = suma + coef*this.a[i][j];
                 sumam=sumam+ coefm*this.a[i][j];
             }
             this.zeta[1][j]= suma;
             this.zeta[2][j]= sumam;
             this.zeta[3][j]=this.c[1][j]-this.zeta[1][j];
             this.zeta[4][j]=this.c[2][j]-this.zeta[2][j];
             
         }
         return 0;
        }catch(err)
        {
            alert("Calcular zeta "+err.message);
        }
     }
     jsimplex.prototype.documentarmatrix=function()
     {
         try
         {
         if (this.documentar)
         {
             var s="";
             var temp=0;
             
             s= s + "<br><br>";
             s= s + "<div class='Table1'><table >";
                s= s + "<tr>";
                s= s + "<td></td>";
                if (this.maximizar)
                {
                    s= s + "<td>Max Z =</td>";
                }else
                {
                    s= s + "<td>Min Z =</td>";
                }
                for (j=1; j<=this.ntotal; j++)
                {
                    s= s + "<td>"+(this.c[2][j]!=0?this.c[2][j]+"M":this.c[1][j])+"</td>";
                }
                s= s + "<td></td>";
                s= s + "<td></td>";
                s= s + "</tr>";
                s= s + "<tr>";
                s= s + "<td>Coef</td>";
                s= s + "<td>Base</td>";
                for (j=1; j<=this.ntotal; j++)
                {
                    s= s + "<td>"+this.c[0][j]+"</td>";
                }
                s= s + "<td>R.H.S</td>";
                s= s + "<td>Theta</td>";
                s= s + "</tr>";
                for (i=1; i<=this.norestricciones; i++)
                {
                    s= s + "<tr>";
                    s= s + "<td>"+(this.c[2][this.base[i]]!=0?this.c[2][this.base[i]]+"M":this.c[1][this.base[i]])+"</td>";
                    s=s + "<td>"+this.c[0][this.base[i]]+"</td>";
                    for (j=1; j<=this.ntotal+1; j++)
                    {
                        temp=this.a[i][j];
                        temp = redondear(temp,2);
                        temp= temp.toString()+" ";
                        s= s+"<td>"+temp  +"</td>";
                    }
                    temp = this.theta[i];
                    temp= redondear(temp,2);
                    temp= temp + " ";
                    s= s+ "<td>"+(this.theta[i]==0?"-":(isNaN(this.theta[i])?"":temp))+"</td>";
                    s= s + "</tr>";
                }
             s= s + "<tr>";
             s= s+ "<td></td>";
             
             s= s+ "<td>Z</td>";
             for (j=1;j<=this.ntotal+1;j++)
             {
                 s= s+ "<td>"+m(this.zeta[2][j],this.zeta[1][j])   +"</td>";
             }
             s= s+"<td></td>";
             s= s + "</tr>";
             s= s + "<tr>";
             s= s+ "<td></td>";
             s= s+ "<td>C<sub>i</sub>-Z<sub>i</sub></td>";
             for (j=1;j<=this.ntotal;j++)
             {
                 s= s+ "<td>"+m(this.zeta[4][j],this.zeta[3][j])+"</td>";
             }
             s= s+ "<td></td>";             
             s= s+"<td></td>";
             s= s + "</tr>";
             s= s + "</table></div>";
             document.getElementById(div).innerHTML += s; 
         }
         return 0;
     }catch(err)
        {
            alert(err.message);
        }
     }
     function m(valorm,valor)
     {
         var s="";
         var temp=0;
         if (valorm==0)
         {
             temp=valor;
             temp = redondear(temp,2);
             temp = temp.toString()+" ";
             return temp;
         }else
         {
             if (valorm==1)
             {
                s="M"; 
             }else
             {
                 temp=valorm;
                 temp = redondear(temp,2);
                 temp = " "+temp ;
                 s= temp+"M";
             }    
         }
         if (valor!= 0)
         {
            if (valor<0)
            {
                temp = valor;
                temp = redondear(temp,2);
                temp = temp + " ";
                s=s +temp;
            }else
            {
                temp= valor;
                temp = redondear(temp, 2);
                temp = temp + " ";
                s= s +" + "+temp;
            }
         }
     return s;    
     }
     jsimplex.prototype.quienentra=function()
     {
         try
         {
         var i = 0; 
         var j = 0;
         var mejor=0;
         var mejorvalor =0;
         var mejordesempate=0;
         
         if (this.maximizar)
         {
             //Para maximizar buscamos el mas grande...
             for (j=1; j<=this.ntotal; j++)
             {
                 //Primero buscar dentro de los que tengan coeficientes con m si no encuentra entonces con numeros...
                 if (this.zeta[4][j]>mejorvalor)
                 {
                     mejor =j;
                     mejorvalor = this.zeta[4][j];
                 }
             }
             //Si encontró un valor, se puede retornar...
             if ( mejor> 0)
             { 
               //hay que tener en cuenta los empates en m, par desemparar...
                for (j=1; j<= this.ntotal; j++)
                {
                    if (this.zeta[4][j]== mejorvalor )
                    {
                        if (this.zeta[3][j] > mejordesempate   )
                        {
                            mejordesempate = this.zeta[3][j];
                            mejor = j;
                        }
                    }                    
                }    
                     
                 if (this.documentar)
                 {
                     document.getElementById(div).innerHTML+="<br><br>Variable que entra: "+this.c[0][mejor] ;
                 }
                 return mejor;
             }else
             {
                 //buscar dentro de los valores sin m...
                 for (j=1; j<=this.ntotal; j++)
                 {
                     if (this.zeta[4][j]==0) //por si las moscas había una z negativa...
                     {    
                        if (this.zeta[3][j]>mejorvalor)
                        {
                            mejorvalor= this.zeta[3][j];
                            mejor=j;
                        }
                    }
                 }
                  if (this.documentar)
                 {
                     document.getElementById(div).innerHTML+="<br><br>Variable que entra: "+this.c[0][mejor] ;
                 }
                 return mejor; //Si no encontró nada, retornará cero... y en ese caso se ha terminado...
             }    
         }else
         {
             //Para minimizar buscamos el mas pequeño...
             //Para maximizar buscamos el mas grande...
             mejordesempate = 9999999999;
             for (j=1; j<=this.ntotal; j++)
             {
                 //Primero buscar dentro de los que tengan coeficientes con m si no encuentra entonces con numeros...
                 if (this.zeta[4][j] < mejorvalor)
                 {
                     mejor =j;
                     mejorvalor = this.zeta[4][j];
                 }
             }
             //Si encontró un valor, se puede retornar...
             if ( mejor > 0)
             {
                 //evaluar el desempate de m con los n
                 for (j=1; j<=this.ntotal; j++)
                 {
                     if (this.zeta[4][j] == mejorvalor)
                     {
                         if (this.zeta[3][j] < mejordesempate)
                         {
                             mejordesempate = this.zeta[3][j];
                             mejor = j;
                         }
                     }
                 }                 
                     
                 if (this.documentar)
                 {
                     document.getElementById(div).innerHTML+="<br><br>Variable que entra: "+this.c[0][mejor] ;
                 }
                 return mejor;
             }else
             {
                 //buscar dentro de los valores sin m...
                 for (j=1; j<=this.ntotal; j++)
                 {
                     if (this.zeta[4][j]==0)
                     {    
                        if (this.zeta[3][j] < mejorvalor)
                        {
                            mejorvalor= this.zeta[3][j];
                            mejor=j;
                        }
                    }
                 }
                 if (this.documentar)
                 {
                     if (mejor!=0)
                     {
                         document.getElementById(div).innerHTML+="<br><br>Variable que entra: "+this.c[0][mejor] ;
                     }else
                     {
                         document.getElementById(div).innerHTML+="<br><br>Se encontró la solución: ";
                     }
                 }               
                 
                 return mejor; //Si no encontró nada, retornará cero... y en ese caso se ha terminado...
             }    
         } 
     }catch(err)
        {
            alert(err.message);
        }         
     }
     jsimplex.prototype.quiensale = function(varentrante)
     {
     try
        {
            var i=0;
            var numerador=0;
            var denominador=0;
            var varsaliente=0;
            var menor=0;
            var mayor=999999999999;

            for (i=1; i<=this.norestricciones;i++)
            {
               denominador = this.a[i][varentrante];
               numerador = this.a[i][this.ntotal+1];
               if (denominador==0)
               {
                   this.theta[i] =  0;
               }else
               {
                   if (numerador/denominador <0)
                   {
                       this.theta[i] = 0;
                   }else
                   {
                       this.theta[i]=numerador/denominador;
                   }    
               }    
            }

            for (i=1; i<=this.norestricciones; i++)
            {
                if (this.theta[i]>mayor)
                {
                    mayor=this.theta[i];
                }
            }
            //Sólo estaba buscando un valor grande, para luego buscar el menor... no es la mejor forma, pero es 
            //la mas rapida que se me ocurrio...
            menor = mayor; //Bastante loca esta línea...
            for (i=1; i<= this.norestricciones; i++)
            {
                if (this.theta[i]!= 0)
                {
                    if (this.theta[i] <= menor )
                    {
                        menor = this.theta[i];
                        varsaliente= i;
                    }
                }
            }
            if (this.documentar)
                    {
                        if (varsaliente!=0)
                        {
                            document.getElementById(div).innerHTML+="<br>Variable que sale: "+this.c[0][this.base[varsaliente]] ;
                        }else
                        {
                            document.getElementById(div).innerHTML+="<br>Ooops! No sale nadie. No hay solución";
                            this.tiposolucion = 3;
                            return 0;
                        }
                    }
           return varsaliente;
         }catch(err)
           {
               alert(err.message);
           }
      }
     jsimplex.prototype.gauss=function(ifila,icolumna)
     {
       var i = 0;
       var j = 0;
       var k = 0;
       var filapivote= new Array(this.ntotal+1);
       var filatemp = new Array(this.ntotal+1);
       var s="";
       var pivote=0;
       var temp=0;
       var num=0;
       
       try 
       {
       if (ifila > this.norestricciones ) {return false;}
       if (icolumna > this.ntotal+1 )  {return false;}
       
       s= s+ "<br><div class='gauss'>";
       s= s +"<table border='0' cellspacing='20'>";
       s= s+ "<tr>";
       s= s+ "<td><b>Gauss-Jordan</b>:Fila Pivote</td>";
       
       for (j=1; j<=this.ntotal+1; j++)
       {
           num = this.a[ifila][j];
           s= s+ "<td>"+ num.toPrecision(2)  +"</td>";
       }
       s= s+ "</tr>";
       
       s= s+ "<tr>";
       s= s+ "<td>Fila Pivote convertida</td>";
       
       pivote = this.a[ifila][icolumna];
       
       if (pivote==0)
       {
           s= s +  "Se presentó un error: pivote igual a cero";
           return 0;
       }
       
       for (j=1; j<=this.ntotal+1; j++)
       {
           this.a[ifila][j] = this.a[ifila][j]/pivote;
           num = this.a[ifila][j];
           s= s+ "<td>"+ num.toPrecision(2)  +"</td>";
       }
       s= s+ "</tr>";
       
       s= s + "<tr>";
       for (j=1; j<=this.ntotal+2;j++)
       {
           s= s +"<td></td>";
       }
       s= s +"</tr>";
       
       for (i=1; i<=this.norestricciones; i++)
       {
           if (i != ifila)
           {
               //
               s = s  + "<tr>";
               s = s  + "<td>Restricci&oacute;n "+i+"</td>";
               for (j=1; j<= this.ntotal+1; j++)
               {
                   num = this.a[i][j];
                    s= s+ "<td>"+ num.toPrecision(2)  +"</td>";
               }
               s = s  + "</tr>";
               
               s = s + "<tr>";
               
               temp =  this.a[i][icolumna]*-1;
               
               s = s  + "<td>Fila pivote * "+temp.toPrecision(2)+"</td>";               
               for (j=1; j<=this.ntotal+1; j++)
               {
                   num = this.a[ifila][j]*temp;
                   s = s + "<td>"+num.toPrecision(2)+"</td>";
               }
               s = s + "</tr>";
               
               s= s + "<tr>";
               s= s +"<td>Nueva restricción "+i+"</td>";
               for (j=1; j<=this.ntotal+1;j++)
               {
                   this.a[i][j]= this.a[i][j] +  this.a[ifila][j]*temp;
                   num = this.a[i][j];
                   s= s+ "<td>"+ num.toPrecision(2) +"</td>";
               }
               s= s +"</tr>";               
               
                s= s + "<tr>";
               for (j=1; j<=this.ntotal+2;j++)
               {
                   s= s +"<td></td>";
               }
               s= s +"</tr>";
               
               
           }
       }
       
       s= s + "</table>";
       s= s + "</div>";
       
           
       if (this.documentar)
       {
           document.getElementById(div).innerHTML += s;
       }
       this.base[ifila]= icolumna;
       return 0;
           }catch(err)
         {
             //alert(err.message);
         } 
     }
     
    jsimplex.prototype.solucionencontrada=function()
    {
        //Evaluar si se halló una solución...
        //Depende del objetivo del problema...
        //Respuestas posibles:
        //1.Solución no encontrada. Se puede mejorr.
        //2.Solución óptima encontrada
        //3. No hay solución
        //4. Soluciones infinitas
        
        try
        {
        
        var i=0;
        var j=0;
        var m=0;
        var n=0;
        var s="";
        
        if (this.maximizar)
        {
            for (j=1; j<=this.ntotal;j++)
            {
                if (this.zeta[4][j] > 0 )
                {
                    //encontró una m positiva...
                    
                    return 1;
                }
                if (this.zeta[3][j] > 0)
                {
                    //Hay un valor positivo en numeros...
                    if (this.zeta[4][j] < 0)
                    {
                        //una m negativa neutraliza la n positiva...
                        //no hacer nada...
                    }
                    if (this.zeta[4][j] == 0)
                    {
                        
                        return 1;
                    }
                }
            }
            //nadie entra a mejorar la solución... pero si hay una variable
            //artificial en la base con un valor positivo en la solución, significa que
            //no hay solucion posible...
            // 
            for (j=1; j<= this.noas; j++)
            {
                //sólo entra, si hay variables artificiales en el problema...
               if (this.valorvariable(this.noxs+this.noss+j) != 0 )
               {
                   //changos!! El problema no tiene solución!!!
                   this.tiposolucion = 3;
                   return 3;
               }
            }
            return 2;

                           
        }else
        {
           for (j=1; j<=this.ntotal;j++)
            {
                if (this.zeta[4][j] < 0 )
                {
                    //encontró una m positiva...
                    
                    return 1;
                }
                if (this.zeta[3][j] < 0)
                {
                    //Hay un valor positivo en numeros...
                    if (this.zeta[4][j] > 0)
                    {
                        //una m negativa neutraliza la n positiva...
                        //no hacer nada...
                    }
                    if (this.zeta[4][j] == 0)
                    {
                        
                        return 1;
                    }
                }
            }
             for (j=1; j<= this.noas; j++)
            {
                //sólo entra, si hay variables artificiales en el problema...
               if (this.valorvariable(this.noxs+this.noss+j) != 0 )
               {
                   //changos!! El problema no tiene solución!!!
                   this.tiposolucion = 3;
                   return 3;
               }
            }
            
            return 2;
    
        } 
        }catch(err)
        {
           // alert("Solucion encontrada "+err.message);
        }
        
    } 
    
     jsimplex.prototype.solucionar=function()
     {  
        var i=0;
        var j=0;
        var k=0;
        var num=0;
        var s="";
        var ntablas=0;
        this.normalizar();
        this.calcularzeta();
        while( this.solucionencontrada() == 1 )
            {                
                i= this.quienentra();
                j= this.quiensale(i);
                if (j==0)
                {
                    //no sale nadie! Oops. No hay solución.
                    this.tiposolucion = 3;
                    break;
                }    

                this.documentarmatrix();
                this.gauss(j,i);
                ntablas++;
                if (ntablas==100)
                {
                    break;
                }
                this.calcularzeta();
            }  
            this.documentarmatrix();
         //Aqui ya se encuentra una solución...
         for (j=1; j<=this.ntotal; j++)
            {
              num = this.valorvariable(j);  
              num = redondear(num,2),
              s= s + this.c[0][j] + " = " + num +"<br>" ;    
            }
            s =  s +"<b>Z</b> = "+m( this.zeta[2][this.ntotal+1], this.zeta[1][this.ntotal+1]   );
            if (this.tiposolucion==3)
            {
                s = s + "<br>Sin solución!";
            }
            if (this.tiposolucion==4)
            {
                s = s + "<br>Infinitas Soluciones!";
            }

            document.getElementById(div).innerHTML+= s;
       
     } 
     jsimplex.prototype.valorvariable = function(j)
     {
     var i=0;
     var k=0;
    for (k=1; k<=this.norestricciones; k++)
            {
                if (this.base[k]==j)
                {
                    return this.a[k][this.ntotal+1];
                }    
            }
     return 0; //Si pasa por aquí es que no está en la base..
     }
     function redondear(numero, decimales)
    {
    var flotante = parseFloat(numero);
    var resultado = Math.round(flotante*Math.pow(10,decimales))/Math.pow(10,decimales);
    return resultado;
    }
 }