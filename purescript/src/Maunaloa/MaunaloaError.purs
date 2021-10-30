module Maunaloa.MaunaloaError where

import Prelude
import Effect 
    ( Effect
    )
import Effect.Class
    ( liftEffect
    )
import Effect.Aff
    ( Aff
    )
import Effect.Console 
    ( logShow
    )

data MaunaloaError = 
    AffjaxError String
    | JsonError String


handleErrorAff :: MaunaloaError -> Aff Unit
handleErrorAff (AffjaxError err) = 
    liftEffect $ logShow $ "AffjaxError: " <> err 
handleErrorAff (JsonError err) = 
    liftEffect $ logShow $ "JsonError: " <> err 