module OptionPurchaseMain where

import Prelude

import Data.Maybe (Maybe(..))

import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Effect.Console (logShow)

import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML (HTMLElement)
import Halogen.Aff as HA
import Halogen.VDom.Driver (runUI)

import HarborView.OptionPurchase.Core as Core


run :: Maybe HTMLElement -> QuerySelector -> Aff Unit
run node qs = 
  case node of 
      Nothing ->
          let 
            QuerySelector qs1 = qs
          in
          liftEffect (logShow $ "No such element: " <> qs1) 
      Just nodex ->
          runUI Core.component unit nodex *>
          pure unit

main :: Effect Unit
main = HA.runHalogenAff $
    HA.awaitLoad *> 
    let 
      qs1 = QuerySelector "#ps-main"
    in
    HA.selectElement qs1 >>= \node ->
      run node qs1
