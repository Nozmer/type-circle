// canva
var canvas = document.getElementById('canvasFile');
var ctx = canvas.getContext('2d');
var filesContent = [];
var indexSelectFile;
var ellipses = [];
var square = [];
var textInElement = [];
var currentEllipse = null; // Referência para a elipse sendo desenhada atualmente
var currentSquare = null; // Referência para a elipse sendo desenhada atualmente
var drag = false;
var isResizing = false;
var resizingEllipse = null;
var resizingSquare = null;
var resizingText = null;
var moveEllipse = null;
var moveSquare = null;
var moveText = null
var existElement = null;
var imageObj = null;

var scaleX, scaleY;

function canva(propertiesCanvaControl) {
    const resizeHandles = [
        { x: 0, y: 0 }, // Canto superior esquerdo
        { x: 1, y: 0 }, // Canto superior direito
        { x: 1, y: 1 }, // Canto inferior direito
        { x: 0, y: 1 } // Canto inferior esquerdo
    ];

    function init() {
        const boxTool = document.querySelectorAll(".box_othersTools")[0];
        const boxSaveOne = document.querySelectorAll(".iconSaveFile");
        const boxAddNewImage = document.querySelectorAll(".boxOptionsFile")[1];

        // mouse
        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mouseup', mouseUp, false);
        canvas.addEventListener('mousemove', mouseMove, false);

        // click
        boxTool.addEventListener('click', putBoxByAi);
        boxTool.addEventListener('click', putBoxByAi);
        boxSaveOne.forEach(element => {
            element.addEventListener('click', saveFileOne);
        });
        boxAddNewImage.addEventListener('click', function () {
            document.getElementById('fileInputImage').click();
        });

        // change
        document.getElementById('fileInputImage').addEventListener('change', addNewImage);

        // key
        document.addEventListener('keydown', keyDown);
        // ctrl show text
        document.addEventListener("keydown", function (event) {
            if (event.key === "Shift") {
                shiftShowTxt(true);
            }
        });

        document.addEventListener("keyup", function (event) {
            if (event.key === "Shift") {
                shiftShowTxt(false);
            }
        });
    };

    function mouseDown(e) {
        const centerX = (e.pageX - this.offsetLeft) * scaleX;
        const centerY = (e.pageY - this.offsetTop) * scaleY;

        // Verifique se o ponto está dentro de alguma elipse existente
        const insideSquareEllipse = square.find(square => {
            // adjusted because of supportPoint
            const adjustedValueRadiusX_Square = square.radiusX + 8;
            const adjustedValueRadiusY_Square = square.radiusY + 8;

            return isPointInsideRectangle(centerX, centerY, square.squareX, square.squareY, adjustedValueRadiusX_Square, adjustedValueRadiusY_Square);
        });

        const insideEllipse = ellipses.find(ellipse => {
            return isPointInsideEllipse(centerX, centerY, ellipse.centerX, ellipse.centerY, ellipse.radiusX, ellipse.radiusY);
        });

        if (!insideSquareEllipse) {
            // Crie uma nova elipse
            currentEllipse = {
                centerX: centerX,
                centerY: centerY,
                radiusX: 0,
                radiusY: 0,
                rotation: 0
            };

            currentSquare = {
                squareX: 0,
                squareY: 0,
                radiusX: 0,
                radiusY: 0,
                rotation: 0
            };

            existElement = currentSquare;

            // Adicione a elipse ao array
            ellipses.push(currentEllipse);
            square.push(currentSquare);

            // add in propertiesDraw
            const propertiesDrawCircleControl = {
                validAddBox: true
            };
            drawCircleProperties(propertiesDrawCircleControl);

            drag = true;
        } else {
            const resizingHandle = isPointInsideResizeHandle(centerX, centerY, insideSquareEllipse);
            const indexOfSquare = square.indexOf(insideSquareEllipse);

            if (!resizingHandle) {
                if (!insideEllipse) {
                    moveEllipse = ellipses[indexOfSquare];
                } else {
                    moveEllipse = insideEllipse;
                };

                // check text exist inside element
                if (textInElement) {
                    let existText_element = false;

                    textInElement.forEach(txt => {
                        if (txt.indexSquare == indexOfSquare) {
                            existText_element = txt;
                        };
                    });

                    if (existText_element) {
                        moveText = existText_element;
                    };
                };

                moveSquare = insideSquareEllipse;
            } else {
                let listStyleCursor = ["ne-resize", "se-resize", "sw-resize", "nw-resize"];
                canvas.style.cursor = listStyleCursor[resizingHandle - 1];

                isResizing = true;
                resizingEllipse = ellipses[indexOfSquare];
                resizingSquare = insideSquareEllipse;

                // check text exist inside element
                if (textInElement) {
                    let existText_element = false;

                    textInElement.forEach(txt => {
                        if (txt.indexSquare == indexOfSquare) {
                            existText_element = txt;
                        };
                    });

                    if (existText_element) {
                        resizingText = existText_element;
                    };
                };

            };

            existElement = insideSquareEllipse;

            // clicking activates ref
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0);

            // Redraw existing ellipses
            ellipses.forEach(ellipse => {
                drawEllipseRefText(ctx, ellipse);
            });

            // Redraw existing text
            if (textInElement.length > 0) {
                textInElement.forEach(txt => {
                    drawTextInElement(ctx, txt);
                });
            };

            // Redraw only square select
            drawRefSquare(ctx, insideSquareEllipse);

            // drawSupportPoint
            drawSupportPoint(ctx, insideSquareEllipse);

            // send drawCircleProperties to select element
            const propertiesDrawCircleControl = {
                selectBox: true,
                indexSelectBox: indexOfSquare
            };
            drawCircleProperties(propertiesDrawCircleControl);

        }
    }

    function mouseUp(e) {
        const centerX = (e.pageX - this.offsetLeft) * scaleX;
        const centerY = (e.pageY - this.offsetTop) * scaleY;

        canvas.style.cursor = 'default';
        isResizing = false;
        drag = false;
        resizingEllipse = null;
        resizingSquare = null;
        resizingText = null
        currentEllipse = null;
        currentSquare = null;
        moveSquare = null;
        moveEllipse = null;
        moveText = null

        const insideSquare = square.find(square => {
            return isPointInsideRectangle(centerX, centerY, square.squareX, square.squareY, square.radiusX, square.radiusY);
        });

        if (!insideSquare) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0);

            // Redraw existing ellipses
            ellipses.forEach(ellipse => {
                drawEllipseRefText(ctx, ellipse);
            });

            // Redraw existing text
            if (textInElement.length > 0) {
                textInElement.forEach(txt => {
                    drawTextInElement(ctx, txt);
                });
            };
        };
    };

    function mouseMove(e) {
        if (drag && currentEllipse) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0);
            canvas.style.cursor = 'pointer';

            // drawElipseText
            currentEllipse.radiusX = Math.abs(currentEllipse.centerX - (e.pageX - this.offsetLeft) * scaleX);
            currentEllipse.radiusY = Math.abs(currentEllipse.centerY - (e.pageY - this.offsetTop) * scaleY);
            drawEllipseRefText(ctx, currentEllipse);

            // Redraw existing ellipses
            if (ellipses.length > 0) {
                ellipses.forEach(ellipse => {
                    drawEllipseRefText(ctx, ellipse);
                });
            }

            // Redraw existing text
            if (textInElement.length > 0) {
                textInElement.forEach(element => {
                    drawTextInElement(ctx, element);
                });
            };

            // drawRefSquare
            currentSquare.squareX = currentEllipse.centerX - currentEllipse.radiusX;
            currentSquare.squareY = currentEllipse.centerY - currentEllipse.radiusY;
            currentSquare.radiusX = currentEllipse.radiusX * 2;
            currentSquare.radiusY = currentEllipse.radiusY * 2;

            // Redraw only square created
            drawRefSquare(ctx, currentSquare);

            // drawSupportPoint
            drawSupportPoint(ctx, currentSquare);
        };

        if (moveSquare) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0);

            canvas.style.cursor = 'grab';
            const newX = (e.pageX - canvas.offsetLeft) * scaleX;
            const newY = (e.pageY - canvas.offsetTop) * scaleY;

            // Atualize as coordenadas da elipse selecionada
            moveEllipse.centerX = newX;
            moveEllipse.centerY = newY;

            // Redesenhe a elipse selecionada
            drawEllipseRefText(ctx, moveEllipse);

            if (moveText) {
                moveText.centerXText = newX;
                moveText.centerYText = newY;
            };

            // Redesenhe as elipses existentes
            ellipses.forEach(ellipse => {
                drawEllipseRefText(ctx, ellipse);
            });

            // Redraw existing text
            if (textInElement.length > 0) {
                textInElement.forEach(txt => {
                    drawTextInElement(ctx, txt);
                });
            };

            // drawRefSquare
            moveSquare.squareX = moveEllipse.centerX - moveEllipse.radiusX;
            moveSquare.squareY = moveEllipse.centerY - moveEllipse.radiusY;

            drawRefSquare(ctx, moveSquare);

            // drawSupportPoint
            drawSupportPoint(ctx, moveSquare);
        };

        if (isResizing && resizingSquare && resizingEllipse) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0);

            const mouseX = (e.pageX - canvas.offsetLeft) * scaleX;
            const mouseY = (e.pageY - canvas.offsetTop) * scaleY;

            // Redimensione a elipse com base na posição do mouse
            resizingEllipse.radiusX = Math.abs(resizingEllipse.centerX - mouseX);
            resizingEllipse.radiusY = Math.abs(resizingEllipse.centerY - mouseY);
            drawEllipseRefText(ctx, resizingEllipse);

            // Redraw existing ellipses
            ellipses.forEach(ellipse => {
                drawEllipseRefText(ctx, ellipse);
            });

            // drawRefSquare
            const deltaX = mouseX - resizingEllipse.centerX;
            const deltaY = mouseY - resizingEllipse.centerY;

            resizingSquare.squareX = resizingEllipse.centerX - resizingEllipse.radiusX;
            resizingSquare.squareY = resizingEllipse.centerY - resizingEllipse.radiusY;
            resizingSquare.radiusX = resizingEllipse.radiusX * 2;
            resizingSquare.radiusY = resizingEllipse.radiusY * 2;

            // resizing in text
            if (resizingText) {
                resizingText.maxWidth = resizingSquare.radiusX;
            };

            // Redraw existing text
            if (textInElement.length > 0) {
                textInElement.forEach(txt => {
                    drawTextInElement(ctx, txt);
                });
            };

            // Redraw only square created
            drawRefSquare(ctx, resizingSquare);

            // drawSupportPoint
            drawSupportPoint(ctx, resizingSquare);
        };
    };

    function keyDown(e) {
        if (e.key == "Delete" && existElement) { // Verifica se a tecla Delete foi pressionada e moveCircleSelect está definido
            const indexToRemove = square.indexOf(existElement);

            if (indexToRemove !== -1) {
                // Remova a elipse selecionada do array ellipses

                // remove in propertiesDraw
                const propertiesDrawCircleControl = {
                    indexRemove: indexToRemove
                };
                drawCircleProperties(propertiesDrawCircleControl);

                ellipses.splice(indexToRemove, 1);
                square.splice(indexToRemove, 1);
                if (textInElement.length > 0) {
                    textInElement.forEach(txt => {
                        if (txt.indexSquare == indexToRemove) {
                            const indexToRemoveTxt = textInElement.indexOf(txt);
                            if (textInElement[indexToRemoveTxt + 1]) {
                                for (let i = indexToRemoveTxt + 1; i < textInElement.length; i++) {
                                    textInElement[i].indexSquare = textInElement[i].indexSquare - 1;
                                };
                            };
                            textInElement.splice(indexToRemoveTxt, 1);
                        };
                    });
                };

                // Limpe o canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imageObj, 0, 0);

                // Redraw existing ellipses
                ellipses.forEach(ellipse => {
                    drawEllipseRefText(ctx, ellipse);
                });

                // Redraw existing text
                if (textInElement.length > 0) {
                    textInElement.forEach(txt => {
                        drawTextInElement(ctx, txt);
                    });
                };

                // Redefina moveCircleSelect para null
                existElement = null;
            };
        };
        if (e.ctrlKey && e.key === "v" && existElement) {
            const index = square.indexOf(existElement);
            // send drawCircleProperties to paste text
            const propertiesDrawCircleControl = {
                pasteText: true,
                indexPasteText: index
            };
            drawCircleProperties(propertiesDrawCircleControl);
        };
    };

    function putBoxByAi() {
        // Dados que você deseja enviar para o servidor
        const load = document.querySelectorAll(".loadgif")[0];
        const finish = document.querySelectorAll(".finishTask")[0];
        load.style.display = "block";

        var info = { image: filesContent[indexSelectFile].url };

        // Configuração da solicitação POST
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        };

        // Envie a solicitação para o servidor
        fetch('/get_positions_box', requestOptions)
            .then(response => response.json())
            .then(data => {
                let positions = data.positions

                positions.forEach(position => {
                    currentEllipse = {
                        centerX: position[0] + position[2] / 2,
                        centerY: position[1] + position[3] / 2,
                        radiusX: position[2] / 2,
                        radiusY: position[3] / 2,
                        rotation: 0
                    };

                    currentSquare = {
                        squareX: position[0],
                        squareY: position[1],
                        radiusX: position[2],
                        radiusY: position[3],
                        rotation: 0
                    };

                    ellipses.push(currentEllipse);
                    square.push(currentSquare);

                    // add in propertiesDraw
                    const propertiesDrawCircleControl = {
                        validAddBox: true
                    };
                    drawCircleProperties(propertiesDrawCircleControl);
                    load.style.display = "none";
                    finish.style.display = "block";
                    setTimeout(function () {
                        finish.style.display = "none";
                    }, 2000);
                });

                ellipses.forEach(ellipse => {
                    drawEllipseRefText(ctx, ellipse);
                });
            });
    };

    function saveFileOne() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageObj, 0, 0);

        // Redraw existing text

        if (textInElement.length > 0) {
            textInElement.forEach(txt => {
                drawTextInElement(ctx, txt);
            });
        };

        let dt = canvas.toDataURL('image/jpeg');
        this.href = dt;
    };

    function addNewImage(e) {
        // save changes of indexSelectFile
        if (filesContent.length > 0) {
            filesContent[indexSelectFile].properties = {
                url: filesContent[indexSelectFile].url,
                ellipses: ellipses,
                square: square,
                textInElement: textInElement
            };

            // remove boxes in interface
            for (let index = ellipses.length - 1; index >= 0; index--) {
                // remove in propertiesDraw
                const propertiesDrawCircleControl = {
                    indexRemove: index
                };
                drawCircleProperties(propertiesDrawCircleControl);
            }

            // reset values 
            ellipses = [];
            square = [];
            textInElement = [];
        };

        var files = e.target.files;
        if (files) {
            // remove backgroud hidden and animate
            const backgroud = document.querySelectorAll(".hiddenBackgroud")[0];
            if (backgroud.style.background != "transparent") {
                removeBackgroundHidden(0, 0);
                removeBackgroundHidden(1, 1);
                removeBackgroundHidden(2, 2);
            };

            for (let i = 0; i < files.length; i++) {
                let file = files[i];

                if (file.type.startsWith("image/")) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        imageObj = new Image();
                        imageObj.onload = function () {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            canvas.width = imageObj.width;
                            canvas.height = imageObj.height;

                            canvas.style.height = innerHeight + "px";

                            scaleX = canvas.width / canvas.offsetWidth;
                            scaleY = canvas.height / canvas.offsetHeight;

                            ctx.drawImage(imageObj, 0, 0);

                            var properties = {
                                url: e.target.result,
                                ellipses: [],
                                square: [],
                                textInElement: []
                            };

                            filesContent.push(properties);
                            indexSelectFile = filesContent.length - 1;
                        };
                        imageObj.src = e.target.result;

                        var propertiesFile = {
                            validAddFile: true,
                            urlFile: e.target.result,
                            nameFile: file.name
                        };

                        controlPropertiesFile(propertiesFile);
                    };

                    reader.readAsDataURL(file);
                };
            };
        };
    };

    function selectFile(indexFile, ignoreChange) {
        if (indexFile != indexSelectFile) {
            // save changes of indexSelectFile
            if (!ignoreChange) {
                console.log("aas");
                if (filesContent.length > 0) {
                    filesContent[indexSelectFile].properties = {
                        url: filesContent[indexSelectFile].url,
                        ellipses: ellipses,
                        square: square,
                        textInElement: textInElement
                    };

                    // remove boxes in interface
                    for (let index = ellipses.length - 1; index >= 0; index--) {
                        // remove in propertiesDraw
                        const propertiesDrawCircleControl = {
                            indexRemove: index
                        };
                        drawCircleProperties(propertiesDrawCircleControl);
                    }

                    // reset values 
                    ellipses = [];
                    square = [];
                    textInElement = [];
                };
            };

            const propertiesFileSelect = filesContent[indexFile];

            // show select
            imageObj = new Image();
            imageObj.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = imageObj.width;
                canvas.height = imageObj.height;
                canvas.style.height = innerHeight + "px";

                scaleX = canvas.width / canvas.offsetWidth;
                scaleY = canvas.height / canvas.offsetHeight;

                ctx.drawImage(imageObj, 0, 0);

                // reload circles, squares and txt
                ellipses = propertiesFileSelect.ellipses;
                square = propertiesFileSelect.square;
                textInElement = propertiesFileSelect.textInElement;

                // Redraw existing ellipses
                if (ellipses.length > 0) {
                    ellipses.forEach(ellipse => {
                        drawEllipseRefText(ctx, ellipse);

                        // add in propertiesDraw
                        const propertiesDrawCircleControl = {
                            validAddBox: true
                        };
                        drawCircleProperties(propertiesDrawCircleControl);
                    });
                };

                // Redraw existing text
                if (textInElement.length > 0) {
                    textInElement.forEach(txt => {
                        drawTextInElement(ctx, txt);
                    });
                };

                indexSelectFile = indexFile;
            };
            imageObj.src = propertiesFileSelect.url;
        };
    };

    function removeFile(indexFile) {
        // select before
        if (filesContent.length > 1) {
            selectFile(indexFile - 1, true);
        } else {
            // clean canva
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        // remove file
        filesContent.splice(indexFile, 1);
    };

    // auxiliaries
    function shiftShowTxt(isPress) {
        if (isPress) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0);

            // Redraw existing text
            if (textInElement.length > 0) {
                textInElement.forEach(txt => {
                    drawTextInElement(ctx, txt);
                });
            };
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0);

            // Redraw existing ellipses
            ellipses.forEach(ellipse => {
                drawEllipseRefText(ctx, ellipse);
            });

            // Redraw existing text
            if (textInElement.length > 0) {
                textInElement.forEach(txt => {
                    drawTextInElement(ctx, txt);
                });
            };

            if (existElement) {
                // Redraw only square select
                drawRefSquare(ctx, existElement);

                // drawSupportPoint
                drawSupportPoint(ctx, existElement);
            };
        };
    };

    function drawEllipseRefText(ctx, currentEllipse) {
        ctx.strokeStyle = 'rgba(108, 165, 250)';
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgba(108, 165, 250, 0.05)";

        ctx.beginPath();
        ctx.ellipse(currentEllipse.centerX, currentEllipse.centerY, currentEllipse.radiusX, currentEllipse.radiusY, currentEllipse.rotation, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    };

    function drawSupportPoint(ctx, currentSquare) {
        ctx.fillStyle = "rgba(108, 165, 250)";
        const sizePoint = 8;

        resizeHandles.forEach(handle => {
            const x = currentSquare.squareX + (currentSquare.radiusX * handle.x);
            const y = currentSquare.squareY + (currentSquare.radiusY * handle.y);

            ctx.beginPath();
            ctx.ellipse(x - sizePoint / 2 + 4, y - sizePoint / 2 + 4, sizePoint, sizePoint, 0, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    function drawRefSquare(ctx, currentSquare) {
        ctx.fillStyle = "rgba(108, 165, 250, 0.05)";
        ctx.fillRect(currentSquare.squareX, currentSquare.squareY, currentSquare.radiusX, currentSquare.radiusY);

        ctx.strokeStyle = 'rgba(108, 165, 250)'; // Cor da borda
        ctx.lineWidth = 2;
        ctx.strokeRect(currentSquare.squareX, currentSquare.squareY, currentSquare.radiusX, currentSquare.radiusY); // Desenhe o retângulo com borda
    };

    function drawTextInElement(ctx, currentText) {
        var words = currentText.content.split(' ');
        var line = '';
        var lineHeight = currentText.font.match(/\d+/)[0] * currentText.lineHeight;
        var lines = [];

        ctx.font = currentText.font;
        ctx.fillStyle = "rgba(0, 0, 0)";
        ctx.textAlign = currentText.textAlign;
        ctx.textBaseline = currentText.textBaseline;

        for (var i = 0; i < words.length; i++) {
            var testLine = line + words[i] + ' ';
            var testWidth = ctx.measureText(testLine).width;

            if (testWidth > currentText.maxWidth) {
                lines.push(line.trim()); // Adicione a linha à matriz de linhas
                line = words[i] + ' ';
            } else {
                line = testLine;
            }
        }

        lines.push(line.trim()); // Adicione a última linha à matriz de linhas

        // Calcule a altura total do texto
        var totalHeight = lines.length * lineHeight;

        // Calcule a posição Y inicial para que o texto fique centralizado verticalmente
        var startY = currentText.centerYText - totalHeight / 4;

        // Desenhe cada linha com a posição Y ajustada
        for (var j = 0; j < lines.length; j++) {
            ctx.fillText(lines[j], currentText.centerXText, startY + j * lineHeight);
        };
    };

    function selectOneElement(indexElement) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageObj, 0, 0);

        // Redraw existing ellipses
        ellipses.forEach(ellipse => {
            drawEllipseRefText(ctx, ellipse);
        });

        // Redraw existing text
        if (textInElement.length > 0) {
            textInElement.forEach(txt => {
                drawTextInElement(ctx, txt);
            });
        };

        // Redraw only square select
        drawRefSquare(ctx, square[indexElement]);

        // drawSupportPoint
        drawSupportPoint(ctx, square[indexElement]);
    };

    function insertTxtByImport(propertiesInsertTxtByImport) {
        for (let i = 0; i < ellipses.length; i++) {
            const propertiesInsertTxt = [propertiesInsertTxtByImport[0], propertiesInsertTxtByImport[1], propertiesInsertTxtByImport[2], propertiesInsertTxtByImport[3], propertiesInsertTxtByImport[4], propertiesInsertTxtByImport[5][i]];
            addTextInEllpseSelect(i, propertiesInsertTxt);
        };
    };

    function cleanTextsInBox() {
        // reset text 
        textInElement = [];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageObj, 0, 0);

        // Redraw existing ellipses
        ellipses.forEach(ellipse => {
            drawEllipseRefText(ctx, ellipse);
        });

        // Redraw existing text
        if (textInElement.length > 0) {
            textInElement.forEach(txt => {
                drawTextInElement(ctx, txt);
            });
        };
    };

    function addTextInEllpseSelect(indexElement, propertiesInsertTxt) {
        const squareInsert = square[indexElement];

        // Calcula as coordenadas do centro do retângulo
        const centerXText = squareInsert.squareX + squareInsert.radiusX / 2;
        const centerYText = squareInsert.squareY + squareInsert.radiusY / 2;

        let existText = false
        textInElement.forEach(element => {
            if (element.indexSquare == indexElement) {
                existText = true;

                // update
                element.content = propertiesInsertTxt[5];
                element.font = `${propertiesInsertTxt[1]}px ${propertiesInsertTxt[0]}`;
                element.fillStyle = propertiesInsertTxt[2];
                element.textAlign = 'center';
                element.textBaseline = 'middle';
                element.lineHeight = propertiesInsertTxt[3];
                element.maxWidth = squareInsert.radiusX;
                element.centerXText = centerXText;
                element.centerYText = centerYText;
                element.indexSquare = indexElement;

                // reload image
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imageObj, 0, 0);

                // Redraw existing ellipses
                ellipses.forEach(ellipse => {
                    drawEllipseRefText(ctx, ellipse);
                });

                // Redraw existing text
                if (textInElement.length > 0) {
                    textInElement.forEach(txt => {
                        drawTextInElement(ctx, txt);
                    });
                };

                // Redraw only square select
                drawRefSquare(ctx, square[indexElement]);

                // drawSupportPoint
                drawSupportPoint(ctx, square[indexElement]);
            };
        });

        if (!existText) {
            // config text
            textNew = {
                content: propertiesInsertTxt[5],
                font: `${propertiesInsertTxt[1]}px ${propertiesInsertTxt[0]}`,
                fillStyle: propertiesInsertTxt[2],
                textAlign: 'center',
                textBaseline: 'middle',
                lineHeight: propertiesInsertTxt[3],
                maxWidth: squareInsert.radiusX,
                centerXText: centerXText,
                centerYText: centerYText,
                indexSquare: indexElement
            };

            drawTextInElement(ctx, textNew);

            textInElement.push(textNew);
        };
    };

    function isPointInsideRectangle(x, y, rectX, rectY, rectWidth, rectHeight) {
        return x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight;
    };

    function isPointInsideEllipse(x, y, centerX, centerY, radiusX, radiusY) {
        const normalizedX = (x - centerX) / radiusX;
        const normalizedY = (y - centerY) / radiusY;

        return (normalizedX * normalizedX) + (normalizedY * normalizedY) <= 1;
    };

    function isPointInsideResizeHandle(x, y, square) {
        // Verifique se o ponto está dentro de algum dos pontos de apoio (handles) do retângulo
        const expandedHandleSize = 20;

        for (let i = 0; i < resizeHandles.length; i++) {
            const handle = resizeHandles[i];
            const handleX = square.squareX + (square.radiusX * handle.x);
            const handleY = square.squareY + (square.radiusY * handle.y);
            const distance = Math.sqrt((x - handleX) ** 2 + (y - handleY) ** 2);

            if (distance <= expandedHandleSize / 2) {
                return i;
            }
        }
        return null;
    };

    // init
    if (propertiesCanvaControl.validInit != undefined && propertiesCanvaControl.validInit) {
        init();

        if (propertiesCanvaControl.validAddImage) {
            document.getElementById('fileInputImage').click();
        } else if (propertiesCanvaControl.validAddImageLocal) {
            // init by image local (debug) only test, no use
            const backgroud = document.querySelectorAll(".hiddenBackgroud")[0];
            if (backgroud.style.background != "transparent") {
                removeBackgroundHidden(0, 0);
                removeBackgroundHidden(1, 1);
                removeBackgroundHidden(2, 2);
            };

            imageObj = new Image();
            imageObj.onload = function () {
                setTimeout(() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = imageObj.width;
                    canvas.height = imageObj.height;

                    canvas.style.height = innerHeight + "px";

                    scaleX = canvas.width / canvas.offsetWidth;
                    scaleY = canvas.height / canvas.offsetHeight;

                    ctx.drawImage(imageObj, 0, 0);

                    var properties = {
                        url: propertiesCanvaControl.pathImageTest,
                        ellipses: [],
                        square: [],
                        textInElement: []
                    };

                    filesContent.push(properties);
                    indexSelectFile = filesContent.length - 1;
                }, 500);
            };
            imageObj.src = propertiesCanvaControl.pathImageTest;

            var propertiesFile = {
                validAddFile: true,
                urlFile: propertiesCanvaControl.pathImageTest,
                nameFile: "image test"
            };

            controlPropertiesFile(propertiesFile);
        };
    }
    // selectElement
    else if (propertiesCanvaControl.validSelectElement != undefined && propertiesCanvaControl.validSelectElement) {
        selectOneElement(propertiesCanvaControl.indexElementSelect);
    }
    // insert text in box
    else if (propertiesCanvaControl.validInsertTxt != undefined && propertiesCanvaControl.validInsertTxt) {
        addTextInEllpseSelect(propertiesCanvaControl.index, propertiesCanvaControl.propertiesInsertTxt);
    }
    // insert text in box by import
    else if (propertiesCanvaControl.validInsertTxtByImport != undefined && propertiesCanvaControl.validInsertTxtByImport) {
        insertTxtByImport(propertiesCanvaControl.propertiesInsertTxtByImport);
    }
    // clean texts in box
    else if (propertiesCanvaControl.validCleanText != undefined && propertiesCanvaControl.validCleanText) {
        cleanTextsInBox();
    }
    // selectFile
    else if (propertiesCanvaControl.validSelectFile != undefined && propertiesCanvaControl.validSelectFile) {
        selectFile(propertiesCanvaControl.index);
    }
    // remove file
    else if (propertiesCanvaControl.validRemoveFile != undefined && propertiesCanvaControl.validRemoveFile) {
        removeFile(propertiesCanvaControl.indexRemoveFile);
    };
};

// properties circle
let lastElementBoxChange;
let multiValuesSelect = [];

// values default for fonts
let fontDefault = "ccwildwordsintregular";
let fontSizeDefault = "18";
let fontColorDefault = "rgba(0, 0, 0)";
let lineHeightDefault = "1.5";
let alignmentDefault = "0";

function drawCircleProperties(propertiesDrawCircleControl) {
    if (propertiesDrawCircleControl.validAddBox != undefined && propertiesDrawCircleControl.validAddBox) {
        addBoxInList();
    } else if (propertiesDrawCircleControl.selectBox != undefined && propertiesDrawCircleControl.selectBox) {
        selectBoxInListAndSendTab(propertiesDrawCircleControl.indexSelectBox);
    } else if (propertiesDrawCircleControl.pasteText != undefined && propertiesDrawCircleControl.pasteText) {
        pasteContent(propertiesDrawCircleControl.indexPasteText);
    } else {
        removeBoxInList();
    };

    // auxiliaries main
    function addBoxInList() {
        fetch(boxListCircle)
            .then(response => response.text())
            .then(template => {
                const compiledTemplate = Handlebars.compile(template);
                const renderedHtml = compiledTemplate();
                const insertElement = document.querySelector('#listCircle');
                insertElement.insertAdjacentHTML('beforeend', renderedHtml);

                // select box
                const allBoxes = document.querySelectorAll(".boxListCircle");
                const indexLastBox = allBoxes.length - 1;
                selectBoxInListAndSendTab(indexLastBox);

                // check length to avoid double border
                if (allBoxes.length >= 4) {
                    // re add border if removed before
                    if (allBoxes[indexLastBox - 1].style.borderBottom == "none") {
                        allBoxes[indexLastBox - 1].style.borderBottom = "solid 1px #C1C1C1";
                    };

                    allBoxes[indexLastBox].style.borderBottom = "none"
                };

                const lastBox = insertElement.lastElementChild;
                const inputBox = lastBox.querySelector("input");
                const number = document.querySelectorAll(".boxListCircle").length;
                inputBox.placeholder = "Vazio " + number;

                anime({
                    targets: lastBox,
                    opacity: [0, 1],
                    duration: 300,
                    easing: 'easeOutExpo'
                });

                addEventClickBoxCircle(lastBox);
                addEventInputChangeBox(inputBox);
            });
    };

    function removeBoxInList() {
        let boxListCircle = document.querySelectorAll(".boxListCircle");
        boxListCircle[propertiesDrawCircleControl.indexRemove].remove();
    };

    function selectBoxInListAndSendTab(indexElement, multiSelect) {
        const allBoxes = document.querySelectorAll(".boxListCircle");
        if (!multiSelect) {
            allBoxes.forEach(box => {
                box.id = "";
            });
        };

        // select
        allBoxes[indexElement].id = "selectBoxListCircle";

        // scroll
        allBoxes[indexElement].scrollIntoView({ behavior: "smooth" });

        // send tab
        updateValuesInTab_ShowTab(indexElement);
    };

    function pasteContent(indexElement) {
        const allInput = document.querySelectorAll(".boxListCircle input");
        allInput[indexElement].value = "";
        allInput[indexElement].focus();

        setTimeout(function () {
            allInput[indexElement].blur();
        }, 50);
    };

    function updateValuesInTab_ShowTab(indexElement) {
        const allBoxes = document.querySelectorAll(".boxListCircle");

        let content = allBoxes[indexElement].dataset.propertiestext;
        const [font, fontSize, fontColor, lineHeight, alignment] = content.split('/');

        // update
        document.querySelector("#rowFontText_propertiesTextAndCircle .boxInput input").value = fontSize;
        document.querySelectorAll("#styleText_propertiesTextAndCircle input")[0].value = fontColor;
        document.querySelectorAll("#styleText_propertiesTextAndCircle input")[1].value = lineHeight;
        lastElementBoxChange = allBoxes[indexElement];

        // show and add event
        const box_propertiesTextAndCircle = document.querySelector("#column_propertiesTextAndCircle");
        if (box_propertiesTextAndCircle.style.display == "none") {
            box_propertiesTextAndCircle.style.display = "flex";
            // active event focus in inputs column
            addEventChangeOptions();
        };
    };

    // auxiliaries events
    function addEventClickBoxCircle(element) {
        const textCountElement = document.querySelector("#textCountElement");

        element.addEventListener("click", function (e) {
            const indexElementInBox = Array.from(document.querySelectorAll(".boxListCircle")).indexOf(element);

            if (e.shiftKey) {
                if (element.id === "selectBoxListCircle") {
                    selectBoxInListAndSendTab(indexElementInBox);
                } else {
                    const indexLeastElementInBox = Array.from(document.querySelectorAll(".boxListCircle")).indexOf(lastElementBoxChange);

                    for (let i = indexLeastElementInBox; i < indexElementInBox + 1; i++) {
                        selectBoxInListAndSendTab(i, true);
                    };

                    multiValuesSelect = [indexLeastElementInBox, indexElementInBox + 1];
                    textCountElement.textContent = `${indexElementInBox + 1}: Elementos selecionados`;
                }
            } else {
                // reset
                multiValuesSelect = [];

                selectBoxInListAndSendTab(indexElementInBox);
                textCountElement.textContent = `Elemento ${indexElementInBox} selecionado`;

                let propertiesCanvaControl = {
                    validSelectElement: true,
                    indexElementSelect: indexElementInBox
                };

                canva(propertiesCanvaControl);
            };
        });
    };

    function addEventInputChangeBox(element) {
        // key enter
        element.addEventListener('keydown', function (event) {
            if (event.keyCode === 13) {
                element.blur();
            }
        });

        element.addEventListener("focusout", function () {
            const allInputInBox = document.querySelectorAll(".boxListCircle input");
            const boxesArray = [...allInputInBox];
            const indexElementInBox = boxesArray.indexOf(element);

            let content = allInputInBox[indexElementInBox].parentElement.dataset.propertiestext;
            const [font, fontSize, fontColor, lineHeight, alignment] = content.split('/');

            if (element.value != "") {
                const propertiesInsertTxt = [font, fontSize, fontColor, lineHeight, alignment, element.value];
                let propertiesCanvaControl = {
                    validInsertTxt: true,
                    propertiesInsertTxt: propertiesInsertTxt,
                    index: indexElementInBox
                };

                canva(propertiesCanvaControl);
            }
        });
    };

    function addEventChangeOptions() {
        let allinputs = document.querySelectorAll("#column_propertiesTextAndCircle input");

        allinputs.forEach(input => {
            // key enter
            input.addEventListener('keydown', function (event) {
                if (event.keyCode === 13) {
                    input.blur();
                }
            });

            input.addEventListener("focusout", function () {
                // get index
                const allBoxes = document.querySelectorAll(".boxListCircle");
                const boxesArray = [...allBoxes];
                const indexElementInBox = boxesArray.indexOf(lastElementBoxChange);

                // get dataset
                let content = allBoxes[indexElementInBox].dataset.propertiestext;
                const [font, fontSize, fontColor, lineHeight, alignment] = content.split('/');

                // get input from lastElementBoxChange
                const inputBox = lastElementBoxChange.querySelector("input");

                // get values from column propertiesTextAndCircle
                let [boxInputFontSize] = document.querySelectorAll("#rowFontText_propertiesTextAndCircle .boxInput input");
                let [colorFont, lineHeightFont] = document.querySelectorAll("#styleText_propertiesTextAndCircle input");

                // if exist multiValuesSelect update all dataset of boxListCircle
                if (multiValuesSelect.length > 0) {
                    const inputsAllBox = document.querySelectorAll(".boxListCircle input");

                    for (let i = multiValuesSelect[0]; i < multiValuesSelect[1]; i++) {
                        // lebrar de pegar o font e alig
                        allBoxes[i].dataset.propertiestext = `${font}/${boxInputFontSize.value}/${colorFont.value}/${lineHeightFont.value}/${alignment}`;

                        // if exist inputs values in index element send canva
                        if (inputsAllBox[i].value != "") {
                            const propertiesInsertTxt = [font, boxInputFontSize.value, colorFont.value, lineHeightFont.value, alignment, inputsAllBox[i].value];

                            let propertiesCanvaControl = {
                                validInsertTxt: true,
                                propertiesInsertTxt: propertiesInsertTxt,
                                index: i
                            };

                            canva(propertiesCanvaControl);
                        };
                    };
                } else {
                    // if not update only lastElementBox
                    lastElementBoxChange.dataset.propertiestext = `${font}/${boxInputFontSize.value}/${colorFont.value}/${lineHeightFont.value}/${alignment}`;

                    // if exist input value in lastElementBoxChange send canva
                    if (inputBox.value != "") {
                        const propertiesInsertTxt = [font, boxInputFontSize.value, colorFont.value, lineHeightFont.value, alignment, inputBox.value];

                        let propertiesCanvaControl = {
                            validInsertTxt: true,
                            propertiesInsertTxt: propertiesInsertTxt,
                            index: indexElementInBox
                        };

                        canva(propertiesCanvaControl);
                    };
                };

            });
        });
    };
};

function controlPropertiesFile(propertiesFile) {
    if (propertiesFile.validAddFile != undefined && propertiesFile.validAddFile) {
        addFileInDiv();
    };

    // main
    function addFileInDiv() {
        // remove selects 
        const boxFile = document.querySelectorAll(".listFiles_boxFile");
        if (boxFile.length > 1) {
            boxFile.forEach(element => {
                element.id = "";
            });
        };

        const handlebarsTemplate = `
                    <img class="imageFile" src="{{urlFile}}" alt="">
                    <h2>{{nameFile}}</h2>
                    <a href="" class="iconSaveFile" download="{{nameFile}}">
                        <img src="{{downloadIcon}}" alt="">
                    </a>
                    <img class="removeFile" src="{{deleteIcon}}" alt="">
                `;

        const data = {
            imageObj: imageObj,
            nameFile: propertiesFile.nameFile,
            urlFile: propertiesFile.urlFile,
            downloadIcon: downloadIcon,
            deleteIcon: deleteIcon
        };

        const compiledTemplate = Handlebars.compile(handlebarsTemplate);

        // Crie um elemento DOM a partir do HTML gerado pelo modelo compilado
        const html = compiledTemplate(data);
        const element = document.createElement('div');
        element.className = "listFiles_boxFile no-select";
        if (boxFile.length > 0) {
            boxFile.forEach(element => {
                element.id = "";
            });
        };
        element.id = "select_boxFile";

        element.innerHTML = html;
        const compiledElement = element;

        // add event
        addEventClickInFile_passCanvaToSelect(compiledElement);
        addEventClickRemoveFile(compiledElement);

        // Insira o elemento no documento
        const insertElement = document.querySelector('#listFiles');
        insertElement.appendChild(compiledElement);
    };

    // auxiliaries events
    function addEventClickInFile_passCanvaToSelect(elementFile) {
        elementFile.addEventListener("click", function (e) {
            // make sure it's not the remove button
            if (e.target.className != "removeFile") {
                const boxFile = document.querySelectorAll(".listFiles_boxFile");
                const index = Array.from(boxFile).indexOf(this);

                boxFile.forEach(element => {
                    element.id = "";
                });

                elementFile.id = "select_boxFile";

                let propertiesCanvaControl = {
                    validSelectFile: true,
                    index: index
                };

                canva(propertiesCanvaControl);
            };
        });
    };

    function addEventClickRemoveFile(elementFile) {
        const buttonRemove = elementFile.querySelector(".removeFile");

        buttonRemove.addEventListener("click", function () {
            const boxFile = document.querySelectorAll(".listFiles_boxFile");
            const index = Array.from(boxFile).indexOf(elementFile);

            elementFile.remove();

            // select before
            if (boxFile.length > 1) {
                boxFile[index - 1].id = "select_boxFile";
            };

            // send canva for remove
            let propertiesCanvaControl = {
                validRemoveFile: true,
                indexRemoveFile: index
            };
            canva(propertiesCanvaControl);
        });
    };
};

function importTextToCanva() {
    const fileInput = document.getElementById('fileInputImportText');
    const button = document.querySelector("#addFileImport .buttonIconExtension");
    let textsInBox = document.querySelectorAll(".contentLineTextImport");

    // main fuctions
    button.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const fileContent = e.target.result;
                const lines = fileContent.split('\n');
                const linesWithValue = [];

                // check if exist lines
                if (lines == "") {
                    boxErroAnimateShow("Arquivo sem linhas");
                } else {
                    // get linesWithValue
                    lines.forEach((line) => {
                        if (line != "") {
                            linesWithValue.push(line);
                        };
                    });

                    // change to confirmFileImport and add
                    let propertiesImport = {
                        validAdd: true,
                        linesWithValue: linesWithValue
                    };
                    propertiesImportTextToCanva(propertiesImport);

                    // add event drag
                    eventDragChangePosition();

                    // send canva
                    sendCanvaInnerText();
                };
            };

            reader.readAsText(file);
        }
    });

    function addTextInBoxDrawCircle() {
        const addFileImport = document.querySelector("#addFileImport");
        const confirmFileImport = document.querySelector("#confirmFileImport");

        const boxListCircle = document.querySelectorAll(".boxListCircle");

        const boxListCircleInput = document.querySelectorAll(".boxListCircle input");
        const buttonAdd = document.querySelector("#addTextFile");

        buttonAdd.addEventListener("click", function () {
            // put values em boxList
            for (let i = 0; i < boxListCircle.length; i++) {
                boxListCircle[i].dataset.propertiestext = `${fontDefault}/${fontSizeDefault}/${fontColorDefault}/${lineHeightDefault}/${alignmentDefault}`;
                boxListCircleInput[i].value = textsInBox[i].innerHTML;
            };

            // back addFileImport and clean elements previwBox
            addFileImport.style.display = "flex";
            confirmFileImport.style.display = "none";

            const insertElement = document.querySelector('#elements_previwBox');
            insertElement.innerHTML = "";

            // send to list box
            const menu1 = document.querySelector("#content_drawCircleProperties");
            const menu2 = document.querySelector("#content_importText");

            menu2.style.display = "none";
            menu1.style.display = "flex";
        });
    };

    // auxiliaries
    function propertiesImportTextToCanva(propertiesImport) {
        const addFileImport = document.querySelector("#addFileImport");
        const confirmFileImport = document.querySelector("#confirmFileImport");

        if (propertiesImport.validAdd != undefined && propertiesImport.validAdd) {
            addFileImport.style.display = "none";
            confirmFileImport.style.display = "flex";

            const handlebarsTemplate = `
                <div class="indicator_text_import">
                    <div class="indicatorTextPut">
                        <div class="ellipseIndicator"></div>
                        <h2>{{indexLine}}</h2>
                    </div>
                    <h2 class="contentLineTextImport">{{contentLine}}</h2>
                </div>
                <img src="{{moveIcon}}" alt="">
            `;

            const insertElement = document.querySelector('#elements_previwBox');
            propertiesImport.linesWithValue.forEach((line, index) => {
                const data = {
                    indexLine: index + 1,
                    contentLine: line,
                    moveIcon: moveIcon
                };

                const compiledTemplate = Handlebars.compile(handlebarsTemplate);
                const html = compiledTemplate(data);

                const div = document.createElement('div');
                div.draggable = true;
                div.className = "boxTextAddImport";
                div.innerHTML = html;

                insertElement.appendChild(div);
            });
        };

        addTextInBoxDrawCircle();
    };

    function eventDragChangePosition() {
        const boxTextAddImport = document.querySelectorAll(".boxTextAddImport");
        let elementDragOver;
        let activeElement;

        boxTextAddImport.forEach(element => {
            element.addEventListener('dragstart', function (e) {
                elementDragOver = element;
            });
            element.addEventListener('dragover', function (e) {
                if (elementDragOver != element) {
                    if (!activeElement) {
                        const rect = element.getBoundingClientRect();
                        const rect1 = elementDragOver.getBoundingClientRect();

                        let offsetY1 = rect.y - rect1.y;
                        let offsetY2 = rect1.y - rect.y;

                        const parent = element.parentNode;
                        if (offsetY1 > 0) {
                            // change position element in DOM
                            parent.insertBefore(element, elementDragOver);

                            // rename text 
                            let textElement1 = elementDragOver.querySelectorAll("h2")[0];
                            let textElement2 = element.querySelectorAll("h2")[0];
                            textElement1.innerHTML = parseInt(textElement1.innerHTML) + 1;
                            textElement2.innerHTML = parseInt(textElement2.innerHTML) - 1;
                        } else {
                            // change position element in DOM
                            parent.insertBefore(elementDragOver, element);

                            // rename text 
                            let textElement1 = elementDragOver.querySelectorAll("h2")[0];
                            let textElement2 = element.querySelectorAll("h2")[0];
                            textElement1.innerHTML = parseInt(textElement1.innerHTML) - 1;
                            textElement2.innerHTML = parseInt(textElement2.innerHTML) + 1;
                        };

                        anime({
                            targets: elementDragOver,
                            translateY: [-offsetY1, 0],
                            duration: 300,
                            easing: 'easeOutExpo'
                        });

                        anime({
                            targets: element,
                            translateY: [-offsetY2, 0],
                            duration: 300,
                            easing: 'easeOutExpo',
                            complete: function () {
                                activeElement = false;
                            }
                        });

                        activeElement = true;
                    };

                    elementDragOver = element;
                };
            });
            element.addEventListener('dragend', function (e) {
                activeElement = false;

                // update textsInBox
                textsInBox = document.querySelectorAll(".contentLineTextImport");

                // active send canva after change element
                sendCanvaInnerText();
            });
        });
    };

    function sendCanvaInnerText() {
        const textsInBox = document.querySelectorAll(".contentLineTextImport");
        const arrayTextsInBox = [];

        textsInBox.forEach(element => {
            arrayTextsInBox.push(element.innerHTML);
        });

        // clean text canva
        let propertiesCleanCanva = {
            validCleanText: true
        };
        canva(propertiesCleanCanva);

        // send text canva
        const propertiesInsertTxtByImport = [fontDefault, fontSizeDefault, fontColorDefault, lineHeightDefault, alignmentDefault, arrayTextsInBox];
        let propertiesCanvaControl = {
            validInsertTxtByImport: true,
            propertiesInsertTxtByImport: propertiesInsertTxtByImport
        };

        canva(propertiesCanvaControl);
    };
};

// auxiliaries
function changeSubMenuProperties() {
    const tabs = document.querySelectorAll("#drawCircleProperties .tabElement");
    const menu1 = document.querySelector("#content_drawCircleProperties");
    const menu2 = document.querySelector("#content_importText");

    tabs.forEach((element, index) => {
        element.addEventListener("click", function () {
            const indexRemove = index == 0 ? 1 : 0;
            tabs[indexRemove].id = "";
            tabs[index].id = "selectTab";

            const elementShow = index == 0 ? menu1 : menu2;
            const elementHidden = index == 1 ? menu1 : menu2;

            elementShow.style.display = "flex";
            elementHidden.style.display = "none";
        });
    });
};

function customStyleSelect() {
    // custom style select by W3Schools

    var x, i, j, l, ll, selElmnt, a, b, c;
    /*look for any elements with the class "custom-select":*/
    x = document.getElementsByClassName("custom-select");
    l = x.length;

    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /*for each element, create a new DIV that will act as the selected item:*/
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /*for each element, create a new DIV that will contain the option list:*/
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 1; j < ll; j++) {
            /*for each option in the original select element,
            create a new DIV that will act as an option item:*/
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function (e) {
                /*when an item is clicked, update the original select box,
                and the selected item:*/
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function (e) {
            /*when the select box is clicked, close any other select boxes,
            and open/close the current select box:*/
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }

    function closeAllSelect(elmnt) {
        /*a function that will close all select boxes in the document,
        except the current select box:*/
        var x, y, i, xl, yl, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < xl; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }

    /*if the user clicks anywhere outside the select box,
    then close all select boxes:*/
    document.addEventListener("click", closeAllSelect);
};  

function boxErroAnimateShow(msg) {
    const box = document.querySelector(".msgErro");
    const boxTxt = document.querySelector(".msgErro h2");
    box.style.display = "flex";
    boxTxt.textContent = msg;

    anime({
        targets: box,
        translateY: 48,
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo'
    });

    setTimeout(function () {
        anime({
            targets: box,
            translateY: -48,
            opacity: [1, 0],
            duration: 600,
            easing: 'easeOutExpo',
            complete: function () {
                box.style.display = "none";
            }
        });
    }, 3000);
};

function removeBackgroundHidden(length1, length2) {
    const backgroud = document.querySelectorAll(".hiddenBackgroud");
    const backgroud1 = document.querySelectorAll(".hiddenBackgroud")[length2];

    backgroud[length1].style.background = "transparent";
    backgroud1.firstElementChild.style.zIndex = "0";

    anime({
        targets: backgroud1.firstElementChild,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutExpo'
    });
};

function focusInBoxInput() {
    const input = document.querySelectorAll("#column_propertiesTextAndCircle input");

    input.forEach((element) => {
        element.addEventListener("focus", function () {
            const box = element.parentElement;
            box.style.transition = "all 0.2s ease"
            box.style.border = "1px solid #8EB1E4";
            box.style.background = "#DCE6F5";
        });
        element.addEventListener("focusout", function () {
            const box = element.parentElement;
            box.style.border = "1px solid #C1C1C1";
            box.style.background = "#EDEDED";
        });
    });
};

document.addEventListener('DOMContentLoaded', function () {
    const buttonAddImages = document.querySelectorAll(".box_menuInitial")[0];
    // initCanvaToTest();

    buttonAddImages.addEventListener("click", function () {
        // init canva
        let propertiesCanvaControl = {
            validInit: true,
            validAddImage: true
        };

        canva(propertiesCanvaControl);

        // style fuction
        customStyleSelect();

        // remove box add and display canva
        const menuInitial = document.querySelector("#menuInitial")
        anime({
            targets: menuInitial,
            opacity: [1, 0],
            duration: 150,
            easing: 'easeOutExpo',
            complete: function () {
                menuInitial.style.display = "none";
                document.querySelector("#canvasFile").style.display = "block";
            }
        });

        // add events auxiliaries
        focusInBoxInput();
        changeSubMenuProperties();
        importTextToCanva();
    });
});

// init by image local (debug) only test, no use
function initCanvaToTest() {
    // init canva
    let propertiesCanvaControl = {
        validInit: true,
        validAddImageLocal: true,
        pathImageTest: imageTest
    };

    canva(propertiesCanvaControl);
    customStyleSelect();
    importTextToCanva();

    // remove box add and display canva
    const menuInitial = document.querySelector("#menuInitial")
    anime({
        targets: menuInitial,
        opacity: [1, 0],
        duration: 150,
        easing: 'easeOutExpo',
        complete: function () {
            menuInitial.style.display = "none";
            document.querySelector("#canvasFile").style.display = "block";
        }
    });

    // add events auxiliaries
    focusInBoxInput();
    changeSubMenuProperties();
};