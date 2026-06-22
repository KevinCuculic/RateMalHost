import { Sticker } from "lucide-react";


export interface Sticker {
  id: string;
  label: string;
  icon: string;
  isImage?: boolean;
}


export const STICKER_CATEGORIES:  Record<string,Sticker[]> = {
  Formen: [
    { id: 'blob', label: 'Fleck', icon: '💧' },
    { id: 'star', label: 'Stern', icon: '⭐' },
    { id: 'heart', label: 'Herz', icon: '❤️' },
    { id: 'hexagon', label: 'Sechseck', icon: '⬢' },
    { id: 'circle', label: 'Kreis', icon: '●' },
    { id: 'square', label: 'Quadrat', icon: '■' },
    { id: 'triangle', label: 'Dreieck', icon: '▲' },
    
  ],
  Natur: [
    { id: 'sun', label: 'Sonne', icon: '☀️' },
    { id: 'tree', label: 'Baum', icon: '🌲' },
    { id: 'tree2', label: 'Baum2', icon: '/sticker/tree.png', isImage: true },
    { id: 'leaves', label: 'leaves', icon: '/sticker/buntysmum-leaves.png', isImage: true },
    { id: 'cherry', label: 'cherry', icon: '/sticker/cherry.png' , isImage: true},
    { id: 'flower1', label: 'flower', icon: '/sticker/4383982.png' , isImage: true},
    { id: 'flower2', label: 'flower', icon: '/sticker/4645828.png' , isImage: true},
    //{ id: 'plant1', label: 'plant', icon: '/sticker/plant1.png' , isImage: true},
    { id: 'palm', label: 'Palme', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f334/512.png', isImage: true },
    { id: 'rose', label: 'Rose', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f339/512.png', isImage: true },
    { id: 'cactus', label: 'Kaktus', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f335/512.png', isImage: true },
    { id: 'mushroom', label: 'Pilz', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f344/512.png', isImage: true },
    { id: 'cloud_rain', label: 'Regenwolke', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f327_fe0f/512.png', isImage: true },
    { id: 'fire', label: 'Feuer', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.png', isImage: true },
    { id: 'rainbow', label: 'Regenbogen', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f308/512.png', isImage: true },
    { id: 'pine-tree', label: 'Tanne', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f332/512.png', isImage: true },

    { id: 'real_rose', label: 'Detail Rose', icon: 'https://api.iconify.design/openmoji:rose.svg', isImage: true },
    { id: 'real_sunflower', label: 'Sonnenblume', icon: 'https://api.iconify.design/openmoji:sunflower.svg', isImage: true },
    { id: 'real_maple', label: 'Ahornblatt', icon: 'https://api.iconify.design/openmoji:maple-leaf.svg', isImage: true },
    { id: 'real_shell', label: 'Muschel', icon: 'https://api.iconify.design/openmoji:spiral-shell.svg', isImage: true },
  ],
  Tiere: [
    { id: 'cat', label: 'Katze', icon: '🐱' },
    { id: 'bird', label: 'vogel', icon: '/sticker/bird.png' , isImage: true},
    { id: 'panda', label: 'panda', icon: '/sticker/panda.png' , isImage: true},
    { id: 'dog', label: 'Hund', icon: '🐶' },
    { id: 'fox', label: 'Fuchs', icon: '🦊' },
    { id: 'lion', label: 'Löwe', icon: '🦁' },
    { id: 'frog', label: 'Frosch', icon: '🐸' },
    { id: 'monkey', label: 'Affe', icon: '🐵' },
    { id: 'chicken', label: 'Küken', icon: '🐥' },
    { id: 'unicorn', label: 'Einhorn', icon: '🦄' },
    { id: 'butterfly', label: 'Schmetterling', icon: '🦋' },
    { id: 'octopus', label: 'Oktopus', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f419/512.png', isImage: true },
    { id: 'cat', label: 'Katze', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f431/512.png', isImage: true },
    { id: 'dog', label: 'Hund', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f436/512.png', isImage: true },
    { id: 'fox', label: 'Fuchs', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f98a/512.png', isImage: true },
    { id: 'frog', label: 'Frosch', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f438/512.png', isImage: true },
    { id: 'unicorn', label: 'Einhorn', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f984/512.png', isImage: true },
    { id: 'butterfly', label: 'Schmetterling', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f98b/512.png', isImage: true },
    { id: 'bee', label: 'Biene', icon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f41d/512.png', isImage: true },

    { id: 'real_eagle', label: 'Adler', icon: 'https://api.iconify.design/openmoji:eagle.svg', isImage: true },
    { id: 'real_owl', label: 'Eule', icon: 'https://api.iconify.design/openmoji:owl.svg', isImage: true },
    { id: 'real_whale', label: 'Wal', icon: 'https://api.iconify.design/openmoji:whale.svg', isImage: true },
    { id: 'real_wolf', label: 'Wolf', icon: 'https://api.iconify.design/openmoji:wolf.svg', isImage: true },
    { id: 'real_butterfly', label: 'Monarchfalter', icon: 'https://api.iconify.design/openmoji:butterfly.svg', isImage: true },
    
  ],
  Collage: [
    { id: 'test', label: 'test', icon: '/sticker/photo.avif' , isImage: true},
    { id: 'speech_bubble', label: 'Sprechblase', icon: '💬' },
    { id: 'heart_bubble', label: 'Herzblase', icon: '💭' },
    { id: 'skull', label: 'Totenkopf', icon: '💀' },
    { id: 'crystal_ball', label: 'Kristallkugel', icon: '🔮' },
    { id: 'ribbon', label: 'Schleife', icon: '🎀' },
    { id: 'rocket', label: 'Rakete', icon: 'https://api.iconify.design/material-symbols:rocket-launch-outline.svg', isImage: true },
    { id: 'trophy', label: 'Pokal', icon: 'https://api.iconify.design/material-symbols:trophy-outline.svg', isImage: true },
    { id: 'anchor', label: 'Anker', icon: 'https://api.iconify.design/material-symbols:anchor.svg', isImage: true },
    { id: 'bolt', label: 'Blitz', icon: 'https://api.iconify.design/material-symbols:bolt.svg', isImage: true },
    { id: 'dino_egg', label: 'Dino Ei', icon: 'https://api.iconify.design/openmoji:sauropod.svg', isImage: true },
    { id: 'game_controller', label: 'Retro Gamepad', icon: 'https://api.iconify.design/openmoji:video-game.svg', isImage: true },
    { id: 'retro_tv', label: 'Röhrenfernseher', icon: 'https://api.iconify.design/openmoji:television.svg', isImage: true },
    { id: 'magic_dice', label: 'Würfel', icon: 'https://api.iconify.design/openmoji:game-die.svg', isImage: true },
    { id: 'hourglass_time', label: 'Sanduhr', icon: 'https://api.iconify.design/openmoji:hourglass-done.svg', isImage: true },
    { id: 'crown_sticker', label: 'Krone', icon: 'https://api.iconify.design/openmoji:crown.svg', isImage: true },
    { id: 'letter_love', label: 'Liebesbrief', icon: 'https://api.iconify.design/openmoji:love-letter.svg', isImage: true },
    
  ],

  
  StickerBuchDoodles: [
    { id: 'happy_cloud', label: 'Süße Wolke', icon: 'https://api.iconify.design/openmoji:cloud-with-rain.svg', isImage: true },
    { id: 'magic_wand', label: 'Zauberstab', icon: 'https://api.iconify.design/openmoji:magic-wand.svg', isImage: true },
    { id: 'pop_heart', label: 'Herz mit Augen', icon: 'https://api.iconify.design/openmoji:heart-with-ribbon.svg', isImage: true },
    { id: 'cherry_cute', label: 'Kirschen Pärchen', icon: 'https://api.iconify.design/openmoji:cherries.svg', isImage: true },
    { id: 'cute_ghost', label: 'Süßer Geist', icon: 'https://api.iconify.design/openmoji:ghost.svg', isImage: true },
    { id: 'mush_doodle', label: 'Fliegenpilz', icon: 'https://api.iconify.design/openmoji:mushroom.svg', isImage: true },
    { id: 'skate_fire', label: 'Feuerball', icon: 'https://api.iconify.design/openmoji:fire.svg', isImage: true },
    { id: 'rainbow_pop', label: 'Retro Regenbogen', icon: 'https://api.iconify.design/openmoji:rainbow.svg', isImage: true },
    { id: 'lucky_cat', label: 'Winke-Katze', icon: 'https://api.iconify.design/openmoji:cat-face.svg', isImage: true },
    { id: 'heart_sparkle', label: 'Glitzer Herz', icon: 'https://api.iconify.design/openmoji:sparkling-heart.svg', isImage: true },
    { id: 'game_boy', label: 'Retro Konsole', icon: 'https://api.iconify.design/openmoji:video-game.svg', isImage: true },
    { id: 'sparkles_clean', label: 'Glitzer Sterne', icon: 'https://api.iconify.design/openmoji:sparkles.svg', isImage: true },
    { id: 'balloon_dog', label: 'Ballonhund', icon: 'https://api.iconify.design/openmoji:balloon.svg', isImage: true },
  ],


  Essen: [
    { id: 'pizza_fun', label: 'Pizza Slice', icon: 'https://api.iconify.design/openmoji:pizza.svg', isImage: true },
    { id: 'popcorn_bucket', label: 'Kino Popcorn', icon: 'https://api.iconify.design/openmoji:popcorn.svg', isImage: true },
    { id: 'bubble_tea_doodle', label: 'Bubble Tea', icon: 'https://api.iconify.design/openmoji:bubble-tea.svg', isImage: true },
    { id: 'ice_pop', label: 'Buntes Eis', icon: 'https://api.iconify.design/openmoji:ice-cream.svg', isImage: true },
    { id: 'pop_donut', label: 'Donut Pink', icon: 'https://api.iconify.design/openmoji:doughnut.svg', isImage: true },
    { id: 'watermelon_art', label: 'Melone', icon: 'https://api.iconify.design/openmoji:watermelon.svg', isImage: true },
    { id: 'cupcake_cute', label: 'Cupcake', icon: 'https://api.iconify.design/openmoji:cupcake.svg', isImage: true },
    
  ],


  FantasyAndMagic: [
    { id: 'magic_potion', label: 'Zaubertrank', icon: 'https://api.iconify.design/openmoji:alembic.svg', isImage: true },
    { id: 'crystal_stone', label: 'Zauberkristall', icon: 'https://api.iconify.design/openmoji:gem-stone.svg', isImage: true },
    { id: 'dragon_baby', label: 'Kleiner Drache', icon: 'https://api.iconify.design/openmoji:dragon-face.svg', isImage: true },
    { id: 'fairy_wings', label: 'Schmetterlings-Flügel', icon: 'https://api.iconify.design/openmoji:butterfly.svg', isImage: true },
    { id: 'key_magic', label: 'Geheimnisvoller Schlüssel', icon: 'https://api.iconify.design/openmoji:old-key.svg', isImage: true },
  ],

  AbenteuerUndNatur: [
    { id: 'camp_fire', label: 'Lagerfeuer', icon: 'https://api.iconify.design/openmoji:fire.svg', isImage: true },
    { id: 'tent_sticker', label: 'Zelt', icon: 'https://api.iconify.design/openmoji:tent.svg', isImage: true },
    { id: 'compass_cool', label: 'Kompass', icon: 'https://api.iconify.design/openmoji:compass.svg', isImage: true },
    { id: 'mountain_pop', label: 'Berge', icon: 'https://api.iconify.design/openmoji:snow-capped-mountain.svg', isImage: true },
    { id: 'map_treasure', label: 'Schatzkarte', icon: 'https://api.iconify.design/openmoji:world-map.svg', isImage: true },
    { id: 'backpack_fun', label: 'Rucksack', icon: 'https://api.iconify.design/openmoji:backpack.svg', isImage: true },
  ],

  SpaceAndFuture: [
    { id: 'rocket_sticker', label: 'Rakete', icon: 'https://api.iconify.design/openmoji:rocket.svg', isImage: true },
    { id: 'ufo_cute', label: 'UFO', icon: 'https://api.iconify.design/openmoji:flying-saucer.svg', isImage: true },
    { id: 'moon_doodle', label: 'Sichelmond', icon: 'https://api.iconify.design/openmoji:crescent-moon.svg', isImage: true },
    { id: 'shooting_star', label: 'Sternschnuppe', icon: 'https://api.iconify.design/openmoji:shooting-star.svg', isImage: true },
    { id: 'saturn_pop', label: 'Saturn Planet', icon: 'https://api.iconify.design/openmoji:ringed-planet.svg', isImage: true },
    { id: 'telescope_fun', label: 'Teleskop', icon: 'https://api.iconify.design/openmoji:telescope.svg', isImage: true },
  ],



  MusikAndParty: [
    { id: 'guitar_rock', label: 'E-Gitarre', icon: 'https://api.iconify.design/openmoji:guitar.svg', isImage: true },
    { id: 'party_popper', label: 'Konfetti-Knaller', icon: 'https://api.iconify.design/openmoji:party-popper.svg', isImage: true },
    { id: 'balloon_pop', label: 'Roter Ballon', icon: 'https://api.iconify.design/openmoji:balloon.svg', isImage: true },
    { id: 'microphone_pop', label: 'Mikrofon', icon: 'https://api.iconify.design/openmoji:microphone.svg', isImage: true },
    { id: 'cassette_tape', label: 'Tape Kassette', icon: 'https://api.iconify.design/openmoji:play-or-pause-button.svg', isImage: true }, // Coole Retro-Vibes
    { id: 'fireworks_sticker', label: 'Feuerwerk', icon: 'https://api.iconify.design/openmoji:fireworks.svg', isImage: true },
  ],

  Sport: [
    { id: 'basketball_pop', label: 'Basketball', icon: 'https://api.iconify.design/openmoji:basketball.svg', isImage: true },
    { id: 'roller_skate', label: 'Rollschuh', icon: 'https://api.iconify.design/openmoji:roller-skate.svg', isImage: true },
    { id: 'trophy_doodle', label: 'Gewinner Pokal', icon: 'https://api.iconify.design/openmoji:trophy.svg', isImage: true },
    { id: 'boxing_glove', label: 'Boxhandschuh', icon: 'https://api.iconify.design/openmoji:boxing-glove.svg', isImage: true },
    { id: 'bicycle_fun', label: 'Fahrrad', icon: 'https://api.iconify.design/openmoji:bicycle.svg', isImage: true },
    { id: 'target_bullseye', label: 'Dartscheibe', icon: 'https://api.iconify.design/openmoji:bullseye.svg', isImage: true },
  ],











};



