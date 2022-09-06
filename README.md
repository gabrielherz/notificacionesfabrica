## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Tue Sep 06 2022 11:13:58 GMT+0200 (hora de verano de Europa central)|
|**App Generator**<br>@sap/generator-fiori-freestyle|
|**App Generator Version**<br>1.7.3|
|**Generation Platform**<br>Visual Studio Code|
|**Floorplan Used**<br>simple|
|**Service Type**<br>None|
|**Service URL**<br>N/A
|**Module Name**<br>notificacionesfabrica|
|**Application Title**<br>Notificaciones de Fabricación|
|**Namespace**<br>notificacionesfabrica|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.102.1|
|**Enable Code Assist Libraries**<br>False|
|**Add Eslint configuration**<br>False|

## notificacionesfabrica

Proyecto UI5 de Notificaciones de Fábrica Derex.

## Descripción
Se ha desarrollado una App para ejecutarse en IPADs dentro de la factoría de la empresa Derex, con el propósito que los Operarios puedan loguearse en las distintas máquinas, dependiendo de las órdenes de producción que se encuentren en el módulo de Planificación y Fabricación de SAP (Transacción PRODPLAN). Una vez logueados los mismos pueden registrar las cantidades de los materiales/componentes empleados, así como los elementos faltantes.

## Contribución
Abierto a cualquier tipo de contribución y sugerencias. Proyecto de ejmplo para el CV.

## Autor
Gabriel Herz.


## Licencia
This file is part of notificacionesfabrica.

notificacionesfabrica is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

notificacionesfabrica is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar. If not, see <https://www.gnu.org/licenses/>.

## Estado del Proyecto
Sin finalizar por requerimiento explísito de la empresa al culminarse mi vida laboral en la misma.

## Uso
 Al iniciar la App, aparece la pantalla de Loguin en la orden de transporte perteneciente al/los operarios a ingresar en máquina
 ![Imagen loginOrdenes.view.xml](https://github.com/gabrielherz/images/blob/derex/blob/pantalla%201%20notif%20f%C3%A1brica.png)
 
 Se selecciona la orden apareciendo así la siguiente pantalla con los operarios a loguear en la misma
 ![Imagen login.view.xml](https://github.com/gabrielherz/images/blob/derex/blob/pantalla%202%20notif%20f%C3%A1brica.png)

Se seleccionan los operarios
![Imagen login.view.xml](https://github.com/gabrielherz/images/blob/derex/blob/pantalla%203%20notif%20f%C3%A1brica.png)

Aparece el listado con los componentes listados de la/los orden/operarios previamente seleccionada/os (Aufnr/Pernr). 
En la parte superior derecha de la pantalla aparece la orden.
Sobre la tabla aparece la cabecera con los detalles básicos del material a fabricar.
![Imagen fabricacion.view.xml](https://github.com/gabrielherz/images/blob/derex/blob/pantalla%204%20notif%20f%C3%A1brica.png)

Para la preparación, se selecciona del menú lateral los "Controles de Proceso"
![Imagen fabricacion.view.xml](https://github.com/gabrielherz/images/blob/derex/blob/pantalla%205%20notif%20f%C3%A1brica.png)

En "Controles de Proceso" se puede navegar entre las distintas tablas correspondientes al proceso de fabricación
![contrProceso.view.xml](https://github.com/gabrielherz/images/blob/derex/blob/pantalla%206%20notif%20f%C3%A1brica.png)

Para que se carguen los IDs de los empleados en las tablas y se puedan modificar los valores relacionados con sus Pernrs, se seleccionan del menú desplegable donde aparece la orden (parte superior derecha de la pantalla)
![contrProceso.view.xml](https://github.com/gabrielherz/images/blob/derex/blob/pantalla%207%20notif%20f%C3%A1brica.png)

Para elegir el tipo de unidad, se pulsa el matchcode del input correspondiente y aparece el listado de la ayuda
![contrProceso.view.xml](https://github.com/gabrielherz/images/blob/derex/blob/pantalla%209%20notif%20f%C3%A1brica.png)



### Starting the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  In order to launch the generated app, simply run the following from the generated app root folder:

```
    npm start
```

#### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org)





