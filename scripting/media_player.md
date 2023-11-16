# Object: media_player

A `media_player` object wraps a [`stream` object](./stream) and handles the presentation of media output inside a view, as if it were displaying content from a normal application. Note that no view object is actually created, but the player itself becomes part of the layout just as a view would. The easiest way to use a media player is to specify a URI referring to a local (e.g., file) or remote (e.g., network stream) resource.

Players are created using the [`new_media_player` method](./server#method-new-media-player) method. See that method for options that may be used when creating media players.

Media players always start in a paused state. You may immediately call the stream's [`play` method](./stream#method-play) to start playing, or seek to a specific time first. Some of the functions here will only apply to media streams that contain video. For audio-only streams, nothing is displayed but the audio is routed to the default output device. Use the [`stream` method](#method-stream) to get access to the underlying stream.

Unless the [`set_size` method](#method-set-size) is called, the media player will automatically size itself to match the source media in case of media sources containing video.

A `media_player` is a visual object and therefore exposes the same methods that all visuals provide. Only methods specific to the `media_player` object are listed here. See the [visual object](./visual) for common visual methods that may be used. To destroy a media player and remove it from the layout, use the visual's [destroy method](./visual#method-destroy).

::: tip Example: Play a local video file in a loop, filling the layout
```lua
local x, y, width, height = server:layout_box();
local player = server:new_media_player("myvideo", x, y, {
    uri = "file:///absolute/path/to/media/file.mp4",
    loop = true
});
player:set_size(width, height);
player:stream():play();
```
Since the `anamorphic` option is not set, the video's aspect ratio is preserved and it may not actually fill the entire layout.
:::

::: tip Example: Play a generated test pattern, filling the layout
```lua
local x, y, width, height = server:layout_box();
local player = server:new_media_player("testpattern", x, y, {
    "videotestsrc ! video/x-raw,width="..width..",height="..height..",format=RGBA ! appsink name=videosink"
});
player:stream():play();
```
:::

## Method: name

| Signature | `name()` |
| - | - |
| Returns | (string) The name of the media player, unique amongst all visual objects. |

Returns the name of the media player visual object. Note that the underlying stream will also be created with this name.

## Method: stream

| Signature | `stream()` |
| - | - |
| Returns | A [`stream` object](./stream) |

Gets the underlying `stream` object that this media player controls. Use this method to access the interface required to play, pause, or seek the stream.

## Method: set_size

| Signature | `set_size(width, height)` |
| - | - |
| width (integer) | The desired width of the media player in pixels. |
| height (integer) | The desired width of the media player in pixels. |
| Returns | Nothing |

Sets the size of the media player. This overrides the default size of the media player which matches the size of the media source. Changing the size can be used to scale video.

The sizing behavior of the media player depends on whether the `anamorphic` option is set when [creating the player](./server#new-media-player). If set to true, the video will be stretched/deformed as necessary to fill the desired space. Otherwise, the video will be scaled to fit within the desired area while maintaining its aspect ratio, with the excess margins (letterbox or pillar-box) being transparent. Therefore, when the player size is different than the video size, the top left corner of the video may not be exactly at the coordinates specified by the player's position in the layout.

