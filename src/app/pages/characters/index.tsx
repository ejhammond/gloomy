import * as React from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import FloatingActionButton from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { ClassIcon } from '../../../components/icons/class-icon';
import { useCharactersRouteContext } from './routes';
import { GridContainer, GridItem } from '../../../components/grid';
import { getLevel } from '../../../configs/levels';
import { classesById } from '../../../configs/classes';

export const Index: React.FC<RouteComponentProps> = function Index() {
  const { charactersList, dispatchCharactersListAction } = useCharactersRouteContext();

  const charactersListValues = Object.values(charactersList);

  return (
    <>
      {charactersListValues.length === 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography>In order to add a character, tap the plus button</Typography>
        </div>
      )}
      <GridContainer component="ul" style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {charactersListValues
          .filter((character) => character !== undefined)
          .map((character) => {
            return (
              <GridItem key={character.id} component="li" span={4}>
                <CharacterRow character={character} />
              </GridItem>
            );
          })}
      </GridContainer>
      <FloatingActionButton
        color="primary"
        style={{
          position: 'fixed',
          bottom: 40,
          right: 40,
        }}
        onClick={() => {
          dispatchCharactersListAction({ type: 'add' });
        }}
      >
        <AddIcon />
      </FloatingActionButton>
    </>
  );
};

function CharacterRow({
  character,
}: {
  character: ReturnType<typeof useCharactersRouteContext>['charactersList'][keyof ReturnType<
    typeof useCharactersRouteContext
  >['charactersList']];
}) {
  return (
    <Link
      to={character.id}
      style={{
        display: 'flex',
        border: '1px solid #999',
        padding: 16,
        borderRadius: 4,

        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex' }}>
          {character.classId !== null ? (
            <Icon>
              <ClassIcon classId={character.classId} />
            </Icon>
          ) : (
            <Icon>?</Icon>
          )}
          <div
            style={{
              marginLeft: 16,

              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textTransform: 'none',
            }}
          >
            <Typography>{character.name || 'Incomplete Character'}</Typography>
            <Typography style={{ color: '#999' }}>
              {character.classId ? classesById[character.classId].name : 'No Class Selected'}
            </Typography>
          </div>
        </div>
        <Typography>
          <span style={{ color: '#999', fontSize: 12 }}>lvl</span>{' '}
          <span style={{ fontSize: 24 }}>{getLevel(character.xp)}</span>
        </Typography>
      </div>
    </Link>
  );
}
