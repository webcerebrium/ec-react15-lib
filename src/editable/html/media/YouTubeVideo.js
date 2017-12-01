import React from 'react';
import { Logger, getStyling } from './../../../services';

export const YouTubeVideo = ({ section, index, props, context, pos }) => {
  Logger.of('render.html.YouTubeVideo').info('section', section, 'index', index, 'props', props, 'context', context);
  const sp = { props, context, pos };
  const { styles, classes } = getStyling({
    ...sp,
    optional: ['autoplay', 'rel', 'modest', 'controls', 'title', 'position'],
    mandatory: ['videoId'],
    styling: ['Block', 'Visibility']
  });
  if (styles === false) return false;

  const videoId = props.videoId;
  const autoplay = props.autoplay ? props.autoplay : 0;
  const rel = props.rel ? props.rel : 1;
  const modest = props.modest ? props.modest : 0;
  const controls = props.controls ? props.controls : 1;
  const title = props.title ? props.title : props.videoId;

  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&rel=${rel}&modestbranding=${modest}
  &controls=${controls}`;

  const stylesList = {
    forPlayer: {
      position: props.position ? props.position : undefined,
      width: props.width ? props.width : '500px',
      height: props.height ? props.height : '281px'
    }
  };

  return (
    <div className={classes.join(' ')} style={styles}>
      <iframe
        title={title}
        style={stylesList.forPlayer}
        type='text/html'
        src={videoSrc}
        frameBorder='0'
      />
    </div>
  );
};

export default {
  YouTubeVideo
};
