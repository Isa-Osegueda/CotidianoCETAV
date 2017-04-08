var Mymodule = (function (){

	//variables globales dentro del IEFI
    var btnaddNewBill = document.getElementById('addBill');
    var btnSave = document.getElementById('save');
    var input = element('input');
    
    //funcion para crear elementos
    function element (e){
        return document.createElement(e);
    }

    //compone las columnas de la tabla en inputs
	function composeColumn(name, row, valor, type,list) {

        var td = element('td');
        var input = element('input');
        input.type = 'text';
        input.setAttribute('name', 'space_' +name);
        input.setAttribute('id', 'space_' +name+ '_ ' +row);
        input.setAttribute('type' , '' + type);
        input.setAttribute('list', '' + list);
        input.value = valor;
        td.appendChild(input);

        
       


        return td ;
    }

    //contador de inputs en cada fila para q todos tengan un nuevo ID
    var n_row = 0;


    //funcion para definir las nuevas variables
    function newRow(){

        addRow(['','','','',''])

    }
    //event agregar fila
    btnaddNewBill.addEventListener('click', newRow);


    //generador de filas
    function addRow (saveData,list){

        var tableBody = document.getElementById('tableBody');
        var tr = element('tr');

        var select = element('select');
        select.setAttribute('id', 'types');
        select.setAttribute('name', 'type');
        var option1 = element('option');
        var option2 = element('option');
        option1.setAttribute('value', 'credito');
        option1.textContent = 'credito';
        option2.setAttribute('value', 'debito');
        option2.textContent = 'debito';
        select.appendChild(option1);
        select.appendChild(option2);

        tr.appendChild(select);
        tr.appendChild(composeColumn('type', n_row,saveData[3],'text','types'));  
        tr.appendChild(composeColumn('amount' , n_row,saveData[1], 'number'));
        tr.appendChild(composeColumn('date', n_row,saveData[2],'date'));
        tr.appendChild(composeColumn('department', n_row, saveData[0]));
        tr.appendChild(composeColumn('description', n_row,saveData[4]));

       /* if(type.value != 'debito'){
          tr.setAttribute('bgColor', 'green');
       }
      else (type != 'credito')

       
            tr.setAttribute('bgColor','red');
        }*/
   



        var t = this;
        var btnDelete = element('button');
        btnDelete.type = 'button';
        btnDelete.innerHTML = 'X';
        btnDelete.setAttribute('id','deleteRow');
        //btnDelete.setAttribute('onclick','deleteRow(event)');
          btnDelete.addEventListener('click', deleteRow);
        
        
       
        
       

        
        var td = element('td');
        td.appendChild(btnDelete);
        tr.appendChild(td);


        tableBody.appendChild(tr);
        n_row++;
    }




    function deleteRow(btnDelete){

        this.btnDelete = btnDelete;
        var row = btnDelete.target.parentNode.parentNode;
        console.log(row);

        row.parentNode.removeChild(row);
        //document.getElementById("bgmodal").style.visibility = "visible";
      
     

    };
    var btnDelete = document.getElementById("deleteRow");
    

    //guardar la data
    btnSave.addEventListener('click', save);

 
    
    
        //document.getElementById("deleteRow").addEventListener('click', deleteRow);














    //guardar los datos editables de la tabla
    function save(){

        var data = [];

        data_department = document.getElementsByName('space_department');
        data_amount = document.getElementsByName('space_amount');
        data_date = document.getElementsByName('space_date');
        data_type = document.getElementsByName('space_type');
        data_description = document.getElementsByName('space_description');

        for (var i = 0; i < data_department.length; i++) {

            data[data.length] = [data_department[i].value, data_amount[i].value,data_date[i].value,data_type[i].value,data_description[i].value];

        }

        //convertir arreglo a un string porque solo se pueden guardar strings
        var string  = JSON.stringify(data);
        window.localStorage.setItem('data_table', string);
    };          















        //Cuando la pagina cargue
        if(window.localStorage.getItem('data_table') != null){

           var string = window.localStorage.getItem('data_table');
           var data = JSON.parse(string);

           for (var i = 0; i < data.length ; i++) {

                var saveData = data[i]; 
                addRow(saveData);
               
           }
           
        }

 
       
            
       
    
   

   

  



    return {

        composeColumn: composeColumn,
        addRow: addRow,
        save:save,
        deleteRow:deleteRow

       
       
       
        

    };






})();



