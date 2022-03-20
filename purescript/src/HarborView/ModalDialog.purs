module HarborView.ModalDialog where

import Prelude

import DOM.HTML.Indexed (HTMLstyle(..))
import Web.UIEvent.MouseEvent (MouseEvent)
import Halogen.HTML as HH
import Halogen.HTML ( HTML
                    , ClassName(..)
                    )
import Halogen.HTML.Properties as HP
import Data.Array ((:))

import HarborView.UI as UI
import HarborView.UI (Title(..))

{- data AlertCategory
    = Info
    | Warn
    | Error -}

data DialogState
    = DialogHidden
    | DialogVisible
    
    --DialogVisibleAlert String String AlertCategory

dlgStateToClass :: DialogState -> ClassName
dlgStateToClass DialogHidden = ClassName "dlg-hide"
dlgStateToClass DialogVisible = ClassName "dlg-show"


modalDialog :: forall w i. 
  Title 
  -> DialogState 
  -> (MouseEvent -> i) 
  -> (MouseEvent -> i) 
  -> HTML w i
  -> HTML w i
modalDialog (Title header) dlgState ok cancel content = 
  let 
    headerDiv =
      HH.h4_ [ HH.text header ]
  in
  HH.div 
    [ HP.classes 
      [ ClassName "modalDialog"
      , dlgStateToClass dlgState 
      ]
    ]
    [ HH.div_
      [ headerDiv 
      , content 
      , UI.mkButton (Title "OK") ok
      , UI.mkButton (Title "Cancel") cancel
      ]
    ]

