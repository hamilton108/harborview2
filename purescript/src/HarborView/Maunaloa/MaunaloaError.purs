module HarborView.Maunaloa.MaunaloaError where

import Prelude

import Effect.Class
    ( liftEffect
    )
import Effect.Aff
    ( Aff
    )
import Effect.Console 
    ( logShow
    )
import HarborView.Maunaloa.Common
    ( alert
    )

data MaunaloaError = 
    AffjaxError String
    | JsonError String


handleErrorAff :: MaunaloaError -> Aff Unit
handleErrorAff (AffjaxError err) = 
    -- liftEffect $ alert $ "AffjaxError: " <> err 
    liftEffect $ logShow $ "AffjaxError: " <> err 
handleErrorAff (JsonError err) = 
    -- liftEffect $ alert $ "JsonError: " <> err 
    liftEffect $ logShow $ "JsonError: " <> err 