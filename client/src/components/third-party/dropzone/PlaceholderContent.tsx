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
                    data-edataid={interactIds.file.add}
                    data-edatatype="DRAG&DROP"
                    data-objectid={`${DropzopType.default}:add:files`}
                    data-objecttype="dataset"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    direction="row"
                    sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
                >
                    <CardMedia
                         data-edataid={interactIds.file.add}
                         data-edatatype="DRAG&DROP"
                         data-objectid={`${DropzopType.default}:add:files`}
                         data-objecttype="dataset"
                        component="img"
                        image={UploadCover}
                        sx={{ width: 100 }}
                    />
                    <Stack
                         data-edataid={interactIds.file.add}
                         data-edatatype="DRAG&DROP"
                         data-objectid={`${DropzopType.default}:add:files`}
                         data-objecttype="dataset"
                        sx={{ p: 3 }}
                        spacing={1}
                    >
                        <Typography variant="h6" fontWeight={500}>Drag & Drop or {' '}
                            <Typography component="span" variant="h6" fontWeight={500} color="primary" sx={{ textDecoration: 'underline' }}>
                                Choose File
                            </Typography>
                            {' '}to upload
                        </Typography>

                        <Typography color="secondary" variant="subtitle1" textAlign="left">Max file size allowed 5mb</Typography>
                    </Stack>
                </Stack>
            )}
        </>
    );
}
