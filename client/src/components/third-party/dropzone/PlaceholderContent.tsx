import { CameraOutlined } from '@ant-design/icons';
import { Typography, Stack, CardMedia } from '@mui/material';

import UploadCover from 'assets/images/upload/upload.svg';
import { interactIds } from 'data/telemetry/interactIds';
import { DropzopType } from 'types/dropzone';


export default function PlaceholderContent({ type }: { type?: string }) {
    return (
        <>
            {type !== DropzopType.standard && (
                <Stack
                id={DropzopType.default}
                data-edataId="add:files"
                data-edataType="DRAG&DROP"
                data-objectId={interactIds.object.id}
                data-objectType="dataset"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    direction={{ xs: 'column', md: 'row' }}
                    sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
                >
                    <CardMedia
                    id={DropzopType.default}
                    data-edataId={interactIds.dataset.create.add}
                    data-edataType="DRAG&DROP"
                    data-objectId={interactIds.object.id}
                    data-objectType="dataset" 
                    component="img" image={UploadCover} sx={{ width: 150 }} />
                    <Stack
                    id={DropzopType.default}
                    data-edataId={interactIds.dataset.create.add}
                    data-edataType="DRAG&DROP"
                    data-objectId={interactIds.object.id}
                    data-objectType="dataset"
                    sx={{ p: 3 }} spacing={1}>
                        <Typography variant="h5">Drag & Drop or Select file</Typography>

                        <Typography color="secondary">
                            Drop files here or click&nbsp;
                            <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                                browse
                            </Typography>
                        </Typography>

                        <Typography color="secondary" variant="subtitle2">Max file size allowed 5mb</Typography>
                    </Stack>
                </Stack>
            )}
            {/* {type === DropzopType.standard && (
                <Stack 
                alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                    <CameraOutlined style={{ fontSize: '32px' }} />
                </Stack>
            )} */}
        </>
    );
}
