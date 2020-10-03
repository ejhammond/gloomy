import * as React from 'react';

import { ClassId } from '../../types';

import beastTyrantIconURL from '../../images/classes/beast-tyrant.png';
import berserkerIconURL from '../../images/classes/berserker.png';
import bladeswarmIconURL from '../../images/classes/bladeswarm.png';
import bruteIconURL from '../../images/classes/brute.png';
import cragheartIconURL from '../../images/classes/cragheart.png';
import doomstalkerIconURL from '../../images/classes/doomstalker.png';
import elementalistIconURL from '../../images/classes/elementalist.png';
import mindthiefIconURL from '../../images/classes/mindthief.png';
import nightshroudIconURL from '../../images/classes/nightshroud.png';
import plagueheraldIconURL from '../../images/classes/plagueherald.png';
import quartermasterIconURL from '../../images/classes/quartermaster.png';
import sawbonesIconURL from '../../images/classes/sawbones.png';
import scoundrelIconURL from '../../images/classes/scoundrel.png';
import soothsingerIconURL from '../../images/classes/soothsinger.png';
import spellweaverIconURL from '../../images/classes/spellweaver.png';
import summonerIconURL from '../../images/classes/summoner.png';
import sunkeeperIconURL from '../../images/classes/sunkeeper.png';
import tinkererIconURL from '../../images/classes/tinkerer.png';

const iconURLs: Record<ClassId, string> = {
  'beast-tyrant': beastTyrantIconURL,
  berserker: berserkerIconURL,
  bladeswarm: bladeswarmIconURL,
  brute: bruteIconURL,
  cragheart: cragheartIconURL,
  doomstalker: doomstalkerIconURL,
  elementalist: elementalistIconURL,
  mindthief: mindthiefIconURL,
  nightshroud: nightshroudIconURL,
  plagueherald: plagueheraldIconURL,
  quartermaster: quartermasterIconURL,
  sawbones: sawbonesIconURL,
  scoundrel: scoundrelIconURL,
  soothsinger: soothsingerIconURL,
  spellweaver: spellweaverIconURL,
  summoner: summonerIconURL,
  sunkeeper: sunkeeperIconURL,
  tinkerer: tinkererIconURL,
};

export function ClassIcon({
  classId,
  style,
  ...delegated
}: React.ComponentPropsWithoutRef<'img'> & { classId: ClassId }) {
  return (
    <div
      style={{
        width: 'inherit',
        height: 'inherit',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        style={{ maxWidth: '100%', maxHeight: '100%', ...style }}
        src={iconURLs[classId]}
        {...delegated}
      />
    </div>
  );
}
