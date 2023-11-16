# Object: stream

A stream is a generic media stream with no display. It can be used to route a media source to some destination, or perform different types of manipulation such as transcoding or filtering. A stream will generally not be used directly by a script author, but instead will be wrapped in a [`media_player` object](./media_player);

Streams are created by calling the [`new_stream` method](./server#method-new-stream) method. See that method for detailed options. When created, streams always start in a paused state; that is, they will buffer any source media but will not begin playing it until the [`play` method](#method-play) is called.

When used via a `media_player` object, the `stream` object's methods can be used by retrieving it from the [`stream()` method](./media_player#method-stream).

## Method: name

| Signature | `name()` |
| - | - |
| Returns | The name of the stream, unique amongst all streams. |

Returns the unique name of the stream.

## Method: play

| Signature | `play()` |
| - | - |
| Returns | Nothing |

Begins playing the stream from the current location (or the beginning if the stream has just been created). If the stream is already playing, this method does nothing.

## Method: pause

| Signature | `pause()` |
| - | - |
| Returns | Nothing |

Pauses the stream at the current location. If the stream is already paused or if the stream is not yet playing, this method does nothing.

## Method: seek

| Signature | `seek(seconds)` |
| - | - |
| seconds (number) | The new desired position in number of seconds (whole and fractional). |
| Returns | Nothing |

Changes the current position in the stream, where `0` is the beginning of the stream. For video, this will seek to the frame nearest to the desired time. This method only works on streams that have source media that support seeking. For example, when used on a live stream, this method does nothing.

## Method: pause

| Signature | `duration()` |
| - | - |
| Returns | (number or nil) The duration of the entire stream in whole and fractional seconds. |

Returns the total length of the stream when applicable. Certain types of streams, such as live streams, may not have a defined duration, in which case this method returns nothing.

## Method: time

| Signature | `time()` |
| - | - |
| Returns | (number or nil) The current time in the stream in whole and fractional seconds. |

Returns the current time from the beginning of the stream, when applicable.

## Method: player

| Signature | `player()` |
| - | - |
| Returns | (`media_player` or nil) The media player controlling this stream. |

If this stream was created by a [`media_player` object](./media_player) then this will return that object. Otherwise, nothing is returned.

## Method: destroy

| Signature | `destroy()` |
| - | - |
| Returns | Nothing |

Destroys the stream, closing any media source it may have been using. The object is no longer valid to use.
