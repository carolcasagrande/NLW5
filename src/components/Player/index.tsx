import { useContext, useRef, useEffect, useState } from 'react';
import { PlayerContext, usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image'; 
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        setPlayingState, 
        togglePlay, 
        toggleLoop,
        toggleShuffle,
        playNext, 
        playPrevious,
        hasNext,
        hasPrevious,
        clearPlayerState 
    } = usePlayer();

    /* toda vez que o isPaying tiver o seu valor mudado, eu quero que algo aconteça */
    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek (amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded () {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

{/* se existir o episódio tocar o audio, caso contrário, selecionar um podcast para ouvir*/}

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                    width={592}
                    height={592}
                    src={episode.thumbnail}
                    objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
            <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
            </div>

            )}

{/* className={!episode ? styles.empty} só usará essa classe caso não tenha o episódio */}
            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                <span>{convertDurationToTimeString(progress)}</span>

                    {/* se eu tiver um episodio eu vou mostrar algo, caso contrario mostro o emptyslider */}
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#84d361'}}
                                railStyle={{ backgroundColor: '#9f75ff'}}
                                handleStyle={{ borderColor: '#84d361', borderWidth: 4}}
                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        )}
                    </div>                    
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {/* só tocará o audio quando tiver um episódio  */}
                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        loop={isLooping}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    {/* disabled={!episode} - caso não tenha o episódio, o botão ficará desativado */}
                    <button 
                    type="button" 
                    disabled={!episode || episodeList.length === 1}
                    onClick={toggleShuffle}
                    className={isShuffling ? styles.isActive : ''}
                    > 
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>

                    {/* se o audio estiver tocando eu mostrar o botão com img pause, caso contrario botão com img play */}
                    <button 
                    type="button" 
                    className={styles.playButton}
                    disabled={!episode}
                    onClick={togglePlay}
                    >
                        { isPlaying 
                        ? <img src="/pause.svg" alt="Pausar"/>
                        : <img src="/play.svg" alt="Tocar"/>
                    }                        
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    {/* se ele estiver Looping, eu vou passar um styles.active, senao fica vazio */}
                    <button 
                    type="button" 
                    disabled={!episode}
                    onClick={toggleLoop}
                    className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}