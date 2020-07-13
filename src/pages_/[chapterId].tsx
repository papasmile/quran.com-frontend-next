import React from 'react';
import range from 'lodash/range';
import { Container, Row } from 'styled-bootstrap-grid';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import VerseType from 'types/VerseType';
import ChapterType from '../../types/ChapterType';
import { getChapters, getChapter, getChapterVerses } from '../api';
import QuranReader from '../components/QuranReader';

type ChapterProps = {
  chaptersResponse: { chapters: ChapterType[] };
  chapterResponse: { chapter: ChapterType };
  versesResponse: { verses: VerseType[] };
};

const Chapter: NextPage<ChapterProps> = ({ chapterResponse: { chapter }, versesResponse }) => {
  return (
    <Container>
      <Row>
        <QuranReader initialData={versesResponse} chapter={chapter} />
      </Row>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const [chaptersResponse, chapterResponse, versesResponse] = await Promise.all([
    getChapters(),
    getChapter(params.chapterId),
    getChapterVerses(params.chapterId),
  ]);
  return {
    props: {
      chapterResponse,
      chaptersResponse,
      versesResponse,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: range(114).map((id) => ({
      params: {
        chapterId: String(id + 1),
      },
    })),
    fallback: false,
  };
};

export default Chapter;