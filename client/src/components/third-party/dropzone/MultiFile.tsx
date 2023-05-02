// material-ui
import { styled } from '@mui/material/styles';
import { Box, Button, Stack } from '@mui/material';

// third-party
import { useDropzone } from 'react-dropzone';

// project import
import RejectionFiles from './RejectionFiles';
import PlaceholderContent from './PlaceholderContent';
import FilesPreview from './FilesPreview';

// types
import { CustomFile, DropzopType, UploadMultiFileProps } from 'types/dropzone';
import { interactIds } from 'data/telemetry/interactIds';

const DropzoneWrapper = styled('div')(({ theme }) => ({
    outline: 'none',
    padding: theme.spacing(5, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    border: `1px dashed ${theme.palette.secondary.main}`,
    '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ==============================|| UPLOAD - MULTIPLE FILE ||============================== //

const MultiFileUpload = ({ error, showList = false, files, type, setFieldValue, sx, onUpload, maxFileSize = 5242880, ...other }: UploadMultiFileProps) => {
    const { onFileRemove } = other || {};
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        multiple: true,
        onDrop: (acceptedFiles: CustomFile[]) => {
            if (files) {
                const data = [
                    ...files,
                    ...acceptedFiles.map((file: CustomFile) => {
                        return Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    }
                    )
                ];
                setFieldValue('files', data);
                onUpload(data);
            } else {
                const data = acceptedFiles.map((file: CustomFile) => {
                    return Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                });
                setFieldValue('files', data);
                onUpload(data);
            }
        },
        accept: {
            'application/json': ['.json'],
            'application/gzip': ['.gz'],
        },
        maxSize: maxFileSize,
    });

    const onRemoveAll = () => {
        setFieldValue('files', null);
        onFileRemove && onFileRemove(null);
    };

    const onRemove = (file: File | string) => {
        const filteredItems = files && files.filter((_file) => _file !== file);
        setFieldValue('files', filteredItems);
        onFileRemove && onFileRemove(filteredItems);
    };

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    ...(type === DropzopType.standard && { width: 'auto', display: 'flex' }),
                    ...sx
                }}
            >
                <Stack {...(type === DropzopType.standard && { alignItems: 'center' })}>
                    <DropzoneWrapper
                        {...getRootProps()}
                        sx={{
                            ...(type === DropzopType.standard && {
                                p: 0,
                                m: 1,
                                width: 64,
                                height: 64
                            }),
                            ...(isDragActive && { opacity: 0.72 }),
                            ...((isDragReject || error) && {
                                color: 'error.main',
                                borderColor: 'error.light',
                                bgcolor: 'error.lighter'
                            })
                        }}
                    >
                        <input {...getInputProps()} />
                        <PlaceholderContent type={type} />
                    </DropzoneWrapper>
                    {type === DropzopType.standard && files && files.length > 1 && (
                        <Button
                        data-edataId={interactIds.file.remove.many}
                        data-edataType="INTERACT"
                        data-objectId="1.0.0"
                        data-objectType="button"
                         variant="contained" color="error" size="extraSmall" onClick={onRemoveAll}>
                            Remove all
                        </Button>
                    )}
                </Stack>
                {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
                {files && files.length > 0 && <FilesPreview files={files} showList={showList} onRemove={onRemove} type={type} />}
            </Box>

            {type !== DropzopType.standard && files && files.length > 0 && (
                <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 1.5 }}>
                    <Button
                    data-edataId={interactIds.file.remove.many}
                    data-edataType="INTERACT"
                    data-objectId="1.0.0"
                    data-objectType="button"
                    color="inherit" size="small" onClick={onRemoveAll}>
                        Remove all
                    </Button>
                    {/* <Button size="small" variant="contained" onClick={() => onUpload(files)}>
                        Upload files
                    </Button> */}
                </Stack>
            )}
        </>
    );
};

export default MultiFileUpload;
