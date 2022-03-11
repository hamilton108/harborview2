module HarborView.Maunaloa.Util.Misc 
    ( plusArray
    ) where

import Data.Array
    ( foldr
    , (:)
    )

plusArray :: forall a. Array a -> Array a -> Array a 
plusArray xa xb = 
    foldr (:) xb xa
