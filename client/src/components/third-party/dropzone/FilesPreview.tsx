import { useTheme } from '@mui/material/styles';
import { Box, List, ListItemText, ListItem, Typography, LinearProgress, LinearProgressProps } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import { DropzopType, FilePreviewProps } from 'types/dropzone';
import { CloseCircleFilled, FileTextOutlined } from '@ant-design/icons';
import { CustomFile } from 'types/dropzone';

function LinearProgressWithLabel({ value, theme, ...props }: any) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '22rem', }}>
            <Box sx={{ width: '20rem', mr: 1, color: theme.palette.primary[400], }}>
                <LinearProgress variant="determinate" color="inherit" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="h6" color="text.secondary">{`${Math.round(
                    value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export function getDropzoneData(file: CustomFile | string, index?: number) {
    if (typeof file === 'string') {
        return {
            key: index ? `${file}-${index}` : file,
            preview: file
        };
    }

    return {
        key: index ? `${file.name}-${index}` : file.name,
        name: file.name,
        size: file.size,
        path: file.path,
        type: file.type,
        preview: file.preview,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate
    };
}

export default function FilesPreview({ showList = false, files, onRemove, type }: FilePreviewProps) {
    const theme = useTheme();
    const hasFile = files.length > 0;
    const layoutType = type;

    return (
        <List
            disablePadding
            sx={{
                ...(hasFile && type !== DropzopType.standard && { my: 3 }),
                ...(type === DropzopType.standard && { width: 'calc(100% - 84px)' })
            }}
        >
            {files.map((file, index) => {
                const { key, name, size, preview, type } = getDropzoneData(file, index);

                if (showList) {
                    return (
                        <ListItem
                            key={key}
                            sx={{
                                p: 0,
                                m: 0.5,
                                width: layoutType === DropzopType.standard ? 64 : 80,
                                height: layoutType === DropzopType.standard ? 64 : 80,
                                borderRadius: 1.25,
                                position: 'relative',
                                display: 'inline-flex',
                                verticalAlign: 'text-top',
                                border: `solid 1px ${theme.palette.divider}`,
                                overflow: 'hidden'
                            }}
                        >
                            {type?.includes('image') && <img alt="preview" src={preview} style={{ width: '100%' }} />}
                            {!type?.includes('image') && <FileTextOutlined style={{ width: '100%', fontSize: '1.5rem' }} />}

                            {onRemove && (
                                <IconButton
                                    size="small"
                                    color="error"
                                    shape="rounded"
                                    onClick={() => onRemove(file)}
                                    sx={{
                                        fontSize: '0.875rem',
                                        bgcolor: 'background.paper',
                                        p: 0,
                                        width: 'auto',
                                        height: 'auto',
                                        top: 2,
                                        right: 2,
                                        position: 'absolute'
                                    }}
                                >
                                    <CloseCircleFilled />
                                </IconButton>
                            )}
                        </ListItem>
                    );
                }

                return (
                    <ListItem
                        key={key}
                        sx={{
                            my: 1,
                            px: 2,
                            py: 0.75,
                            borderRadius: 0.75,
                            border: (theme) => `solid 1px ${theme.palette.divider}`,
                            alignItems: 'center',
                        }}
                    >
                        <FileTextOutlined style={{ width: '30px', fontSize: '1.15rem', marginRight: 4 }} />

                        <ListItemText
                            primary={<Typography variant="body1">{typeof file === 'string' ? file : name}</Typography>}
                            primaryTypographyProps={{ variant: 'subtitle2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                            sx={{ mr: 2, maxWidth: 200, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                        />

                        <LinearProgressWithLabel value={100} theme={theme} />

                        {onRemove && (
                            <IconButton sx={{ ml: 'auto' }} edge="end" size="small" onClick={() => onRemove(file)}>
                                <CloseCircleFilled style={{ fontSize: '1.15rem' }} />
                            </IconButton>
                        )}
                    </ListItem>
                );
            })}
        </List>
    );
}
