module HarborView.Util.Foreign where

import Prelude

import Effect (Effect)
import Effect.Console (logShow)
import Foreign 
  ( F
  , Foreign
  , ForeignError
  , readArray
  , readInt
  , readNumber
  )
import Data.Traversable (traverse,traverse_)
import Data.List.Types (NonEmptyList)

readNumArray :: Foreign -> F (Array Number)
readNumArray value = 
  readArray value >>= traverse readNumber >>= pure

readIntArray :: Foreign -> F (Array Int)
readIntArray value = 
  readArray value >>= traverse readInt >>= pure

logErrors :: NonEmptyList ForeignError -> Effect Unit
logErrors errs = 
  traverse_ logShow errs