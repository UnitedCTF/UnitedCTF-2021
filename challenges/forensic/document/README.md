# LibreOffice document

Ce défi contient 4 flags.

> forensics

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

_La stéganographie est une forme de dissimulation (ou d'offuscation) d'information dans le but de transmettre un message de manière inaperçue au sein d'un autre message. L'information utile est cachée au premier abord et à l'œil nu, mais non protégée pour qui sait où regarder._[[1]](https://www.nomios.fr/actualite/steganographie/)

La stéganographie peut être aussi simple que de changer l'extension d'un fichier pour rendre plus difficile qu'on en découvre le format et elle peut aller aussi loin que de modifier des bits à une certaine fréquence dans une image afin de cacher de l'information. 

Dans des documents Word (doc, docx, odt, pptx, etc.), il y a une multitude de façons de cacher de l'information. Par exemple, on pourrait utiliser une distance différente entre deux paragraphes pour signifier que la première lettre du paragraphe qui suit fait parti d'un message secret. On pourrait aussi changer la couleur de certains caracètres d'un noir rgb(0,0,0) à un noir rgb(0,0,1) pour signifier qu'ils font parti du message.

Le document suivant fût intercepté alors qu'un concepteur de défi a essayé de fuiter des flags à un participant lors de la compétition SouthSec 2021. Ce document contient quatre (4) flags. À première vue, il s'agit d'un document bien normal, qui ne contient aucun flag. Pouvez-vous trouver où les flags se cachent?

## Setup

Requirements:
- LibreOffice
- Unzip utility

# Writeup

## 1- Image abscente

### LibreOffice document 1 (007)

Un document ODT n'est qu'une archive ZIP. En changeant l'extension, on peut l'ouvrir avec un archiveur de fichiers. En explorant le contenu du fichier "Pictures", on peut trouver une image qui n'apparaît pas dans le document. Le flag est écrit sur l'image en texte rouge. 

`flag-f46db7d4246abfa4b3d004204d7447daabe55233`

## 2- Vignette

### LibreOffice document 2 (LSB)

Quand on explore l'archive ZIP, on peut voir que tous les fichiers ont la même date, sauf la vignette (fichier "thumbnail") qui a été créé à exactement quatre heures de différence. La vignette du document est aussi visible si le système d'exploitation supporte de l'afficher comme icône du fichier. On peut voir des pixels de couleur turquoise (cyan). C'est en fait un message encodé en LSB. En utilisant un outil comme https://stegonline.georgeom.net, on peut décoder le contenu de l'image (cet outil particulié requiert de sélectionner le bit 7 du canal de couleur 'R' avec les paramètres par défaut). 

On obtiendra le texte ASCII suivant: `flag-b1cc6a6784402db22365073c1e969d837e8fea43`

(note: il faut garder une colonne de pixels blancs à la droite pour décoder le message, sinon le 3/4 du flag est corrompu)

## 3- Caractères blancs

### LibreOffice document 3 (invisible characters)

Certains caractères contenus dans le document sont blancs (donc invisibles sur fond blanc). On peut s'en appercevoir en changeant le "background color" dans le document afin de créer un contraste. Le script ci-dessous résout le défi automatiquement en cherchant ces caractères. 

`flag-97d4244f362712`

## 4- Caractères ayant une police différente

### LibreOffice document 4 (typographie)

Certains caractères utilisent une police différente. La police la plus utilisée dans le document est Arial, mais il y a aussi des caractères qui utilisent la police Open Sans et Verdana. Les caractères utilisant Verdana sont cachés parmis le texte écrit en Arial. Les polices sont très semblables, donc il est difficile de le remarquer si on n'est pas attentif aux détails. 

Le script ci-dessous résout ce défi automatiquement en charchant ces caractères. 

`flag-b23dcfcff13f`

# Script de vérification des flags

```
REM  *****  BASIC  *****

Sub Main
    Dim flagFont As String
    Dim flagColor As String

    oDoc = ThisComponent
    oCurs = oDoc.currentController.getViewCursor()
    oParEnum = oDoc.Text.createEnumeration()
    Do While oParEnum.hasMoreElements()
      oPar = oParEnum.nextElement()
      If oPar.supportsService("com.sun.star.text.Paragraph") Then
        oSecEnum = oPar.createEnumeration()
        Do While oSecEnum.hasMoreElements()
          oSec = oSecEnum.nextElement()
          If oSec.TextPortionType = "Text" Then
            If oSec.CharFontName = "Verdana" Then
              flagFont = flagFont & oSec.String
            End If
            If Hex(oSec.CharColor) = "FFFFFF" Then
              flagColor = flagColor & oSec.String
            End If
          End If
        Loop
      End If
      
      If oPar.supportsService("com.sun.star.text.TextTable") Then
        nRows = oPar.Rows.count - 1
        nColumns = oPar.Columns.count - 1
        
        for i = 0 to nRows
          for k = 0 to nColumns
            oCell = oPar.getCellbyPosition(k,i)
            oCellTextCursor = oCell.createTextCursor()
            oParEnum2 = oCellTextCursor.createEnumeration() 
            Do While oParEnum2.hasMoreElements()
              oPar2 = oParEnum2.nextElement()
              If oPar2.supportsService("com.sun.star.text.Paragraph") Then
                oSecEnum = oPar2.createEnumeration()
                Do While oSecEnum.hasMoreElements()
                  oSec = oSecEnum.nextElement()
                  If oSec.TextPortionType = "Text" Then
                    If oSec.CharFontName = "Verdana" Then
                      flagFont = flagFont & oSec.String
                    End If
                    If Hex(oSec.CharColor) = "FFFFFF" Then
                      flagColor = flagColor & oSec.String
                    End If
                  End If
                Loop
              End If
            Loop
          next k
        next i
      End If
    Loop
    
    Print "Font flag: " & flagFont
    Print "Font color: " & flagColor

End Sub

```
