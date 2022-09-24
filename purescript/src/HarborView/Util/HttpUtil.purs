module HarborView.Util.HttpUtil where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe(..))

import Effect.Aff.Class (class MonadAff)
import Affjax.Web as Affjax
import Affjax.ResponseFormat as ResponseFormat
import Affjax.RequestBody (RequestBody)

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode.Error (JsonDecodeError)

import Halogen as H

import HarborView.Common  ( HarborViewError(..)
                          , Url(..)
                          ) 

getAff :: forall m r. MonadAff m => Url -> (Json -> (Either JsonDecodeError r)) -> m (Either HarborViewError r)
getAff (Url url) f = 
  H.liftAff $
    Affjax.get ResponseFormat.json url >>= \res ->
      let 
        result :: Either HarborViewError r 
        result = 
          case res of  
            Left err -> 
              Left $ AffjaxError (Affjax.printError err)
            Right response ->
              let 
                fresult = f response.body
              in
              case fresult of
                Left err ->
                  Left $ JsonError (show err)
                Right fresult1 ->
                  Right fresult1 
      in
      pure result


postAff :: forall m r. MonadAff m => 
  Url 
  -> RequestBody 
  -> (Json -> (Either JsonDecodeError r)) 
  -> m (Either HarborViewError r)
postAff (Url url) requestBody f = 
  H.liftAff $
    Affjax.post ResponseFormat.json url (Just requestBody) >>= \res ->
      let 
        result :: Either HarborViewError r 
        result = 
          case res of  
            Left err -> 
              Left $ AffjaxError (Affjax.printError err)
            Right response ->
              let 
                fresult = f response.body
              in
              case fresult of
                Left err ->
                  Left $ JsonError (show err)
                Right fresult1 ->
                  Right fresult1 
      in
      pure result
